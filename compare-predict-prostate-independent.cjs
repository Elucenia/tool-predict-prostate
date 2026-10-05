'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const candidate=path.join(__dirname,'predict-prostate.cjs'),expectedFile=path.join(__dirname,'predict-prostate-independent-expected-r1.json');
const {calculate}=require(candidate),expected=JSON.parse(fs.readFileSync(expectedFile,'utf8'));
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const args=process.argv.slice(2);if(args.length&&!(args.length===2&&args[0]==='--report'&&args[1]))throw Error('Usage: node compare-predict-prostate-independent.cjs [--report NEW_FILE]');
const reportPath=args.length?path.resolve(process.cwd(),args[1]):null;
const tolerance=1e-12;let comparisons=0,maxError=0;const failures=[],rows=[];
function check(id,field,actual,want){comparisons++;const error=Math.abs(actual-Number(want));maxError=Math.max(maxError,error);if(!Number.isFinite(actual)||error>tolerance)failures.push({id,field,expected:want,obtained:actual,error});}
for(const row of expected.rows){const obtained=calculate(row.input);if(!obtained.ok){failures.push({id:row.id,error:obtained});continue;}
 for(const [scenario,want] of Object.entries(row.expected)){const actual=obtained.scenarios[scenario];for(const field of ['piPC','piOther','positiveCorePercent'])check(row.id,scenario+'.'+field,actual[field],want[field]);
  for(const point of want.curve){const actualPoint=actual.curve[point.year];for(const field of ['prostateCancerDeath','otherDeath','overallSurvival','nonCancerSurvival','unpartitionedProstateCancerSurvival'])check(row.id,scenario+'.year'+point.year+'.'+field,actualPoint[field],point[field]);}
 }
 const final=name=>Number(row.expected[name].curve[row.input.years].overallSurvival);
 check(row.id,'summary.conservativeSurvivalPercent',obtained.summary.conservativeSurvivalPercent,100*final('conservative'));
 check(row.id,'summary.radicalSurvivalPercent',obtained.summary.radicalSurvivalPercent,100*final('radical'));
 check(row.id,'summary.absoluteSurvivalDifferencePercentagePoints',obtained.summary.absoluteSurvivalDifferencePercentagePoints,100*(final('radical')-final('conservative')));
 check(row.id,'summary.effectLowerDifferencePercentagePoints',obtained.summary.effectLowerDifferencePercentagePoints,100*(final('radicalHigh')-final('conservative')));
 check(row.id,'summary.effectUpperDifferencePercentagePoints',obtained.summary.effectUpperDifferencePercentagePoints,100*(final('radicalLow')-final('conservative')));
 rows.push({id:row.id,input:row.input,expected:row.expected,obtained,pass:!failures.some(f=>f.id===row.id)});
}
const receipt={generatedAt:new Date().toISOString(),scope:expected.expectationProvenance,execution:'Local candidate module, not HTTP/UI or published build',methodEdition:expected.methodEdition,expectedFile:{path:path.basename(expectedFile),sha256:sha(expectedFile)},adapter:{path:path.basename(candidate),sha256:sha(candidate)},oracle:{path:'predict-prostate-independent-oracle.py',sha256:sha(path.join(__dirname,'predict-prostate-independent-oracle.py'))},cases:rows.length,scenarios:rows.length*4,comparisons,tolerance,maxAbsoluteError:maxError,failures,rows};
let report=null;if(reportPath){fs.writeFileSync(reportPath,JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});report={file:reportPath,sha256:sha(reportPath)};}console.log(JSON.stringify({cases:rows.length,comparisons,maxError,failures:failures.length,report}));if(failures.length)process.exitCode=1;
