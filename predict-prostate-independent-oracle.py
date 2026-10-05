"""Independent 45-digit Decimal oracle derived directly from frozen Clojure source.

No import, execution or reading of the ELUCENIA adapter when deriving expectations.
It computes complete vectors before the separately-run adapter comparison.
Scope: numerical transcription/curves, not independent clinical validation.
"""
from decimal import Decimal as D, getcontext
from pathlib import Path
import hashlib, json, datetime
getcontext().prec = 45
ROOT = Path(__file__).resolve().parent
SOURCES = [ROOT/'predict-prostate-primary/source/src/predict_prostate/models/prostate_release.cljs', ROOT/'predict-prostate-primary/source/src/predict_prostate/models/runner.cljs', ROOT/'predict-prostate-primary/source/src/predict_prostate/models/adapters/predict.cljs']
STAGE = tuple(map(D, ['0','.1614922','.39767881','.6330977']))
GRADE = tuple(map(D, ['0','.2791641','.5464889','.7411321','1.367963']))
RX = {'conservative':D(0), 'radicalLow':D('.35').ln(), 'radical':D('-.6837094'), 'radicalHigh':D('.67').ln()}

def oracle(inp, rx):
    age, psa = D(str(inp['age'])), D(str(inp['psa']))
    positive = D(100)*D(inp['coresInvolved'])/D(inp['coresTaken']) if inp['biopsyAvailable'] else D('41.9415')
    pc_index = (D('.0026005')*((age/10)**3-D('341.155151'))
        + D('.185959')*(((psa+1)/100).ln()+D('1.636423432'))
        + STAGE[inp['tStage']-1] + GRADE[inp['gradeGroup']-1] + rx
        + (D('.956') if inp['brca'] == 1 else 0)
        + (((positive+D('.1811159'))/100).sqrt()-D('.649019'))*D('1.890134'))
    other_index = D('.1226666')*(age-D('69.87427439')) + (D('.6382002') if inp['comorbidity'] == 1 else 0)
    # Source run-prostate forms the cumulative mortality vectors first, then deltas,
    # then allocates each annual all-cause increment using annual cause proportions.
    pc = [D(0)]
    other = [D(0)]
    for year in range(1, inp['years']+1):
        days = D(365*year)
        pc_baseline = (D('-16.40532') + D('1.653947')*days.ln() + D('1.89e-12')*days**3).exp()
        other_baseline = (D('-12.4841') + D('1.32274')*days.ln() + D('2.90e-12')*days**3).exp()
        pc.append(1-(-pc_index.exp()*pc_baseline).exp())
        other.append(1-(-other_index.exp()*other_baseline).exp())
    all_cause = [1-(1-a)*(1-b) for a,b in zip(pc, other)]
    pc_annual = [pc[y]-pc[y-1] for y in range(1,len(pc))]
    other_annual = [other[y]-other[y-1] for y in range(1,len(other))]
    all_annual = [all_cause[y]-all_cause[y-1] for y in range(1,len(all_cause))]
    allocation = [a/(a+b) for a,b in zip(pc_annual,other_annual)]
    pc_partitioned = [D(0)]
    other_partitioned = [D(0)]
    for fraction,increment in zip(allocation,all_annual):
        pc_partitioned.append(pc_partitioned[-1]+fraction*increment)
        other_partitioned.append(other_partitioned[-1]+(1-fraction)*increment)
    curves = []
    for y in range(len(pc)):
        curves.append({'year':y,'prostateCancerDeath':str(pc_partitioned[y]),'otherDeath':str(other_partitioned[y]),
            'overallSurvival':str(1-(pc_partitioned[y]+other_partitioned[y])),
            'nonCancerSurvival':str(1-other[y]),'unpartitionedProstateCancerSurvival':str(1-pc[y])})
    return {'piPC':str(pc_index),'piOther':str(other_index),'positiveCorePercent':str(positive),'curve':curves}

base = {'age':65,'psa':11,'tStage':2,'gradeGroup':4,'hospitalAdmission':0,'comorbidity':None,'brca':0,
        'biopsyAvailable':0,'coresTaken':None,'coresInvolved':None,'metastasis':0,'intraductalOrCribriform':0}
changes = [
    {},
    {'hospitalAdmission':1,'comorbidity':1},
    {'hospitalAdmission':1,'comorbidity':0,'biopsyAvailable':1,'coresTaken':12,'coresInvolved':4},
    {'age':35,'psa':0,'tStage':1,'gradeGroup':1,'biopsyAvailable':1,'coresTaken':100,'coresInvolved':1},
    {'age':95,'psa':100,'tStage':4,'gradeGroup':5,'hospitalAdmission':1,'comorbidity':1,'brca':1,'biopsyAvailable':1,'coresTaken':1,'coresInvolved':1},
    {'age':55,'psa':7.5,'tStage':3,'gradeGroup':3,'brca':1,'biopsyAvailable':1,'coresTaken':20,'coresInvolved':10},
    {'age':72,'psa':19.9,'tStage':2,'gradeGroup':2,'biopsyAvailable':1,'coresTaken':13,'coresInvolved':7},
    {'age':80,'psa':1,'tStage':1,'gradeGroup':5,'hospitalAdmission':1,'comorbidity':0,'intraductalOrCribriform':1},
    {'age':45,'psa':85,'tStage':3,'gradeGroup':5,'hospitalAdmission':1,'comorbidity':1},
    {'age':70,'psa':10,'tStage':2,'gradeGroup':2,'biopsyAvailable':1,'coresTaken':10,'coresInvolved':1},
    {'age':60,'psa':3.14159,'tStage':4,'gradeGroup':1,'brca':1,'biopsyAvailable':1,'coresTaken':97,'coresInvolved':43},
    {'age':90,'psa':.000001,'tStage':1,'gradeGroup':4,'biopsyAvailable':1,'coresTaken':3,'coresInvolved':2},
]
rows=[]
for index,change in enumerate(changes):
    for horizon in [10,15]:
        inp={**base,**change,'years':horizon}
        rows.append({'id':f'synthetic-{index+1:02d}-{horizon}y','input':inp,
            'expected':{name:oracle(inp,rx) for name,rx in RX.items()}})
receipt={'generatedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'methodEdition':'WintonCentre/predict-prostate@761f20b554d9d3021320fd59cf9a73ece02b32b5',
    'expectationProvenance':'Separately authored 45-digit Python Decimal implementation derived from three frozen original Clojure source files; does not import the candidate adapter. Not independent clinical/model validation.',
    'sourceFiles':[{'path':str(p.relative_to(ROOT)), 'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in SOURCES],
    'notes':['Executable source constants supersede outdated docstrings/comments (e.g. .35 remains executable radical-low factor).',
       'The missing conservative treatment coefficient in the original Clojure lookup adds nil, which compiled JavaScript arithmetic treats as zero.',
       'Positive-core percent defaults to 41.9415 only when biopsy information is unavailable.',
       'No inference about calibration, treatment selection or professional translation is made.'], 'rows':rows}
out=ROOT/'predict-prostate-independent-expected-r1.json'
with out.open('x',encoding='utf-8') as stream: json.dump(receipt,stream,ensure_ascii=False,indent=2)
print(json.dumps({'output':str(out),'cases':len(rows),'precision':getcontext().prec}))
