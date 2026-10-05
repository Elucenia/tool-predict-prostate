/* SPDX-License-Identifier: EPL-1.0-or-later
 * Mathematical port of Winton Centre PREDICT Prostate, copyright ©2022 Winton
 * Centre for Risk & Evidence Communication. Source: commit
 * 761f20b554d9d3021320fd59cf9a73ece02b32b5, prostate_release.cljs/runner.cljs.
 * Modified by ELUCENIA on 2026-10-05: strict input contract, structured output,
 * local-only calculation. Original coefficients and annual competing-risk
 * partition retained. EPL text and corresponding original source accompany it.
 * This module does not select a treatment or establish a clinical diagnosis.
 */
'use strict';
const EDITION='WintonCentre/predict-prostate@761f20b554d9d3021320fd59cf9a73ece02b32b5';
const KEYS=['age','psa','tStage','gradeGroup','hospitalAdmission','comorbidity','brca','biopsyAvailable','coresTaken','coresInvolved','metastasis','intraductalOrCribriform','years'];
const T_STAGE={1:0,2:.1614922,3:.39767881,4:.6330977};
const GRADE={1:0,2:.2791641,3:.5464889,4:.7411321,5:1.367963};
const RX={conservative:0,radicalLow:Math.log(.35),radical:-.6837094,radicalHigh:Math.log(.67)};
function runModel(x,rx){
  const ppc=x.biopsyAvailable===1?100*x.coresInvolved/x.coresTaken:41.9415;
  const piPC=.0026005*((x.age/10)**3-341.155151)+.185959*(Math.log((x.psa+1)/100)+1.636423432)
    +T_STAGE[x.tStage]+GRADE[x.gradeGroup]+rx+(x.brca===1?.956:0)
    +(Math.sqrt((ppc+.1811159)/100)-.649019)*1.890134;
  const piOther=.1226666*(x.age-69.87427439)+(x.comorbidity===1?.6382002:0);
  let pcPrev=0,otherPrev=0,allPrev=0,pcCum=0,otherCum=0;
  const curve=[{year:0,prostateCancerDeath:0,otherDeath:0,overallSurvival:1,nonCancerSurvival:1,unpartitionedProstateCancerSurvival:1}];
  for(let y=1;y<=x.years;y++){
    const t=365*y;
    // Keep the same exponential and subtraction operations as the published code.
    const pc=1-Math.exp(-Math.exp(piPC)*Math.exp(-16.40532+1.653947*Math.log(t)+1.89e-12*t**3));
    const other=1-Math.exp(-Math.exp(piOther)*Math.exp(-12.4841+1.32274*Math.log(t)+2.9e-12*t**3));
    const all=1-(1-pc)*(1-other),dPC=pc-pcPrev,dOther=other-otherPrev,dAll=all-allPrev;
    const share=dPC/(dPC+dOther);
    if(!Number.isFinite(share))throw new RangeError('NON_FINITE_PARTITION');
    pcCum+=share*dAll;otherCum+=(1-share)*dAll;
    curve.push({year:y,prostateCancerDeath:pcCum,otherDeath:otherCum,overallSurvival:1-pcCum-otherCum,
      nonCancerSurvival:1-other,unpartitionedProstateCancerSurvival:1-pc});
    pcPrev=pc;otherPrev=other;allPrev=all;
  }
  return {piPC,piOther,positiveCorePercent:ppc,curve};
}
function error(code,field){return {ok:false,error:{code,field},edition:EDITION};}
function calculate(x){
  if(!x||typeof x!=='object'||Array.isArray(x))return error('INPUT_OBJECT','input');
  if(KEYS.some(k=>!Object.hasOwn(x,k))||Object.keys(x).some(k=>!KEYS.includes(k)))return error('INPUT_KEYS','input');
  const range=(k,a,b,int=false)=>typeof x[k]==='number'&&Number.isFinite(x[k])&&x[k]>=a&&x[k]<=b&&(!int||Number.isInteger(x[k]));
  if(!range('age',35,95,true))return error('OUT_OF_RANGE','age');
  if(!range('psa',0,100))return error('OUT_OF_RANGE','psa');
  for(const [k,a,b]of[['tStage',1,4],['gradeGroup',1,5],['hospitalAdmission',0,1],['brca',0,1],['biopsyAvailable',0,1],['metastasis',0,1],['intraductalOrCribriform',0,1]])
    if(!range(k,a,b,true))return error('CATEGORY',''+k);
  if(![10,15].includes(x.years))return error('CATEGORY','years');
  if(x.metastasis===1)return error('OUTSIDE_MODEL_SCOPE','metastasis');
  if(x.hospitalAdmission===1){if(!range('comorbidity',0,1,true))return error('CATEGORY','comorbidity');}
  else if(x.comorbidity!==null)return error('NOT_APPLICABLE','comorbidity');
  if(x.biopsyAvailable===1){
    if(!range('coresTaken',1,100,true))return error('OUT_OF_RANGE','coresTaken');
    if(!range('coresInvolved',1,x.coresTaken,true))return error('OUT_OF_RANGE','coresInvolved');
  }else if(x.coresTaken!==null||x.coresInvolved!==null)return error('NOT_APPLICABLE','biopsyAvailable');
  const scenarios={};for(const[name,rx]of Object.entries(RX))scenarios[name]=runModel(x,rx);
  const final=scenarios.radical.curve[x.years],base=scenarios.conservative.curve[x.years];
  return {ok:true,edition:EDITION,years:x.years,scenarios,summary:{
    conservativeSurvivalPercent:100*base.overallSurvival,radicalSurvivalPercent:100*final.overallSurvival,
    absoluteSurvivalDifferencePercentagePoints:100*(final.overallSurvival-base.overallSurvival),
    effectLowerDifferencePercentagePoints:100*(scenarios.radicalHigh.curve[x.years].overallSurvival-base.overallSurvival),
    effectUpperDifferencePercentagePoints:100*(scenarios.radicalLow.curve[x.years].overallSurvival-base.overallSurvival),
    prostateCancerDeathWithoutRadicalPercent:100*base.prostateCancerDeath,otherDeathWithoutRadicalPercent:100*base.otherDeath,
    positiveCorePercent:scenarios.conservative.positiveCorePercent,biopsyImputed:x.biopsyAvailable===0
  },warningCodes:[...(x.intraductalOrCribriform===1?['INTRADUCTAL_CRIBRIFORM_CAUTION']:[]),...(x.tStage===4?['LESS_TESTED_T4']:[]),...(x.gradeGroup>=4?['LESS_TESTED_HIGH_GRADE']:[]),...(x.biopsyAvailable===0?['AVERAGE_BIOPSY_IMPUTED']:[]),
    'COHORT_CALIBRATION_NOT_GLOBAL','NO_AUTOMATIC_TREATMENT_SELECTION','INDEPENDENT_CLINICAL_REVIEW_NOT_PERFORMED']};
}
module.exports=Object.freeze({EDITION,KEYS,RX,calculate,runModel});
