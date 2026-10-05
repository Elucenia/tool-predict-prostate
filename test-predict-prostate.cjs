'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const folder=__dirname,model=require('./predict-prostate.cjs'),capture=require('./predict-prostate-primary/capture.json');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const args=process.argv.slice(2);if(args.length&&!(args.length===2&&args[0]==='--report'&&args[1]))throw Error('Usage: node test-predict-prostate.cjs [--report NEW_FILE]');
const reportPath=args.length?path.resolve(process.cwd(),args[1]):null;
// Minimal inert reader for the primary fixture's EDN maps/vectors/keywords/numbers/strings.
// Does not evaluate EDN, JavaScript or reader extensions.
function parseEDN(text){let p=0;const space=()=>{while(/[\s,]/.test(text[p]||'')&&p<text.length)p++;};
 function next(){space();const ch=text[p++];if(ch==='['){const a=[];space();while(text[p]!==']'){a.push(next());space();}p++;return a;}
  if(ch==='{'){const o={};space();while(text[p]!=='}'){const k=next();if(typeof k!=='string'||Object.hasOwn(o,k))throw Error('Fixture map');o[k]=next();space();}p++;return o;}
  if(ch==='"'){let end=p;while(end<text.length){if(text[end]==='"'&&text[end-1]!=='\\')break;end++;}if(end===text.length)throw Error('Fixture string');const s=JSON.parse(text.slice(p-1,end+1));p=end+1;return s;}
  if(ch===':'){const start=p;while(p<text.length&&!/[\s,\[\]{}]/.test(text[p]))p++;return text.slice(start,p);}
  if(ch==='n'&&text.slice(p-1,p+2)==='nil'){p+=2;return null;}
  const start=p-1;while(p<text.length&&!/[\s,\[\]{}]/.test(text[p]))p++;const token=text.slice(start,p);if(!/^[-+]?(\d*\.?\d+)(e[-+]?\d+)?$/i.test(token))throw Error('Unsupported EDN '+token);const n=Number(token);if(!Number.isFinite(n))throw Error('Nonfinite EDN');return n;}
 const value=next();space();if(p!==text.length)throw Error('Fixture trailing bytes');return value;}
const fixturePath=path.join(folder,'predict-prostate-primary/source/resources/public/test-runs.txt'),bytes=fs.readFileSync(fixturePath),fixtures=parseEDN(bytes.toString());
const failures=[],observations=[];let checked=0,maxAbs=0;
for(let i=0;i<fixtures.length;i++){
 const row=fixtures[i],s=row['stata-in'],expected=row['stata-out'];
 const x={age:s.age,psa:s.psa,tStage:s['t-stage'],gradeGroup:s['grade-group'],comorbidity:s['charlson-comorbidity'],brca:s.brca,
  biopsyAvailable:s['biopsy-done'],coresTaken:s['biopsy-cores-taken'],coresInvolved:s['biopsy-cores-involved'],years:s.n};
 const rx=({0:0,1:-.6837094,3:.9084921})[s['primary-rx']];if(rx===undefined)throw Error('Unexpected published treatment');
 const actual=model.runModel(x,rx),first=actual.curve[1],obtained={PCSsurvival:first.unpartitionedProstateCancerSurvival,'pred-PC-cum':first.prostateCancerDeath,'pred-NPC-cum':first.otherDeath,'NPC-survival':first.nonCancerSurvival};
 for(const k of Object.keys(expected)){const exp=Number(expected[k]),delta=Math.abs(obtained[k]-exp);checked++;maxAbs=Math.max(maxAbs,delta);if(!Number.isFinite(delta)||delta>1e-6)failures.push({index:i,field:k,expected:exp,obtained:obtained[k],absoluteError:delta});}
 if(i<10)observations.push({index:i,input:s,expected,obtained});
}
const seed={age:65,psa:11,tStage:2,gradeGroup:4,hospitalAdmission:1,comorbidity:0,brca:0,biopsyAvailable:1,coresTaken:12,coresInvolved:3,metastasis:0,intraductalOrCribriform:0,years:15};
const successful=model.calculate(seed);assert.equal(successful.ok,true);
for(const s of Object.values(successful.scenarios))for(const r of s.curve){assert.ok(Number.isFinite(r.overallSurvival));assert.ok(Math.abs(r.overallSurvival+r.prostateCancerDeath+r.otherDeath-1)<3e-15);checked+=2;}
const contracts=[];
function mustReject(input,id){const r=model.calculate(input);assert.equal(r.ok,false,id);contracts.push({id,error:r.error});checked++;}
for(const k of model.KEYS){const x={...seed};delete x[k];mustReject(x,'missing-'+k);}
for(const k of model.KEYS)if(typeof seed[k]==='number')for(const bad of [NaN,Infinity,-Infinity,'1',undefined])mustReject({...seed,[k]:bad},'invalid-'+k+'-'+String(bad));
for(const [k,bad]of [['age',34],['age',96],['age',65.5],['psa',-1],['psa',101],['tStage',5],['gradeGroup',0],['gradeGroup',6],['brca',2],['comorbidity',2],['coresTaken',0],['coresTaken',101],['coresInvolved',0],['coresInvolved',13],['metastasis',1],['intraductalOrCribriform',2],['years',5]])mustReject({...seed,[k]:bad},'range-'+k+'-'+bad);
mustReject({...seed,other:1},'unknown-field');mustReject(null,'null');mustReject([],'array');
const imputed=model.calculate({...seed,biopsyAvailable:0,coresTaken:null,coresInvolved:null});assert.equal(imputed.ok,true);assert.equal(imputed.summary.positiveCorePercent,41.9415);assert.equal(imputed.summary.biopsyImputed,true);checked+=3;
const noAdmission=model.calculate({...seed,hospitalAdmission:0,comorbidity:null});assert.equal(noAdmission.ok,true);assert.deepEqual(noAdmission.summary,successful.summary);checked+=2;
mustReject({...seed,hospitalAdmission:0,comorbidity:0},'inapplicable-comorbidity');
const caution=model.calculate({...seed,intraductalOrCribriform:1});assert.equal(caution.ok,true);assert.ok(caution.warningCodes.includes('INTRADUCTAL_CRIBRIFORM_CAUTION'));assert.deepEqual(caution.summary,successful.summary);checked+=3;
const proof={at:new Date().toISOString(),scope:'Pinned official PREDICT Prostate mathematical model, isolated candidate; no app writes, provider API calls or clinical/language approval',edition:model.EDITION,
 sourceCommit:capture.commit,fixture:{file:path.relative(folder,fixturePath).replaceAll('\\','/'),bytes:bytes.length,sha256:hash(bytes)},adapter:{file:'predict-prostate.cjs',sha256:hash(fs.readFileSync(path.join(folder,'predict-prostate.cjs')))},
 publishedFixtureScope:'Provider fixture compares first-year four outputs even when horizon n=5/10/15. This is explicitly not a full 15-year provider parity test. Source provider tolerance 1e-6 probability retained; absolute difference checked in both directions (provider runner only checked positive differences).',
 summary:{publishedCases:fixtures.length,publishedNumericComparisons:fixtures.length*4,contractRejections:contracts.length,checks:checked,failures:failures.length,maxProbabilityError:maxAbs},failures,observations,contracts,
 fullCurveSynthetic:{input:seed,obtained:successful,scope:'Full curves checked for finite values and conservation only; independent source-derived full-curve oracle still required.'},
 providerLicense:'EPL-1.0-or-later; corresponding source and copyright retained; no individualized agreement accepted',clinicalReview:'not-performed',professionalLanguageReview:'not-performed'};
let report=null;if(reportPath){const reportBytes=JSON.stringify(proof,null,2)+'\n';fs.writeFileSync(reportPath,reportBytes,{flag:'wx'});report={file:reportPath,sha256:hash(reportBytes)};}console.log(JSON.stringify({...proof.summary,report}));if(failures.length)process.exitCode=1;
module.exports={parseEDN};
