# PREDICT Prostate · البقاء

قارن تقديرات البقاء والوفيات مع العلاج الجذري وبدونه باستخدام PREDICT Prostate 1.1. لا تختار الأداة علاجًا.

## الطريقة والإصدار

PREDICT Prostate 1.1 · BRCA/PPC model; pinned official source 761f20b5 (2026-07-30)

## المدخلات

- **العمر عند التشخيص** (`age`, `num`) — سنوات [35–95]
- **مستوى PSA قبل الخزعة أو العلاج** (`psa`, `num`) — نانوغرام/مل [0–100]
- **المرحلة السريرية T** (`tStage`, `sel`)
  - `1`: T1
  - `2`: T2
  - `3`: T3
  - `4`: T4
- **مجموعة الدرجة النسيجية** (`gradeGroup`, `sel`)
  - `1`: 1
  - `2`: 2
  - `3`: 3
  - `4`: 4
  - `5`: 5
- **دخول المستشفى خلال السنتين السابقتين** (`hospitalAdmission`, `sel`)
  - `0`: لا
  - `1`: نعم
- **الأمراض المصاحبة المحددة في النموذج** (`comorbidity`, `sel`)
  - `0`: لا
  - `1`: نعم
- **متغير BRCA1 أو BRCA2** (`brca`, `sel`)
  - `0`: سلبي أو لم يُجرَ الفحص
  - `1`: إيجابي
- **هل بيانات الخزعة متاحة؟** (`biopsyAvailable`, `sel`)
  - `0`: لا
  - `1`: نعم
- **عدد عينات الخزعة المأخوذة** (`coresTaken`, `num`) — عينات خزعة [1–100]
- **عدد العينات المحتوية على سرطان البروستاتا** (`coresInvolved`, `num`) — عينات خزعة [1–100]
- **وجود نقائل سرطانية** (`metastasis`, `sel`)
  - `0`: لا
  - `1`: نعم
- **سرطان داخل القنوات أو مكوّن غربالي غازٍ** (`intraductalOrCribriform`, `sel`)
  - `0`: لا
  - `1`: نعم
- **السنوات بعد التشخيص** (`years`, `sel`)
  - `10`: 10 سنوات
  - `15`: 15 سنوات

## الحدود والمراجعة

للرجال حديثي التشخيص بسرطان بروستاتا غير نقائلي عندما يكون التدبير التحفظي والجذري خيارين مناسبين. لا تضمن تقديرات المجموعات نتيجة فردية. لا يشمل النموذج أضرار العلاج أو جودة الحياة. تدعم الواجهة الأعمار 35–95 سنة، وPSA بين 0–100 نانوغرام/مل، وتقديرات لمدة 10 أو 15 سنة. لا تعيد الترجمة معايرة النموذج لبلد آخر.

الفحوص التقنية متاحة؛ لم تُجرَ مراجعة سريرية أو لغوية مهنية.

يتطلب وجود مكوّن داخل القنوات أو غربالي مراعاة حجمه وامتداده وتصنيفه النسيجي ومواضع الخزعة. إذا كان ملحوظًا، ففسّر الناتج بحذر أو لا تستخدمه.

تستخدم الفحوص التقنية بيانات اصطناعية. لم تُجرَ مراجعة سريرية مستقلة أو مراجعة مهنية للترجمات.

## التشغيل ببيانات اصطناعية

```sh
node cli.cjs examples/input.json ar
```

## النتائج

- `conservativeSurvivalPercent`: التدبير التحفظي (%)
- `radicalSurvivalPercent`: العلاج الجذري (%)
- `absoluteSurvivalDifferencePercentagePoints`: الفرق المطلق في البقاء (نقاط مئوية) (نقاط مئوية)
- `effectLowerDifferencePercentagePoints`: نطاق أثر العلاج الجذري (نقاط مئوية)
- `effectUpperDifferencePercentagePoints`: نطاق أثر العلاج الجذري (نقاط مئوية)
- `prostateCancerDeathWithoutRadicalPercent`: الوفيات بسبب سرطان البروستاتا (%)
- `otherDeathWithoutRadicalPercent`: الوفيات لأسباب أخرى (%)
- `positiveCorePercent`: نسبة عينات الخزعة الإيجابية (%)
- `biopsyImputed`: لا توجد بيانات للخزعة: يستخدم النموذج متوسط نسبة العينات الإيجابية.

## المصدر والحقوق

- https://github.com/WintonCentre/predict-prostate
- https://github.com/WintonCentre/predict-prostate/blob/761f20b554d9d3021320fd59cf9a73ece02b32b5/src/predict_prostate/models/prostate_release.cljs
- https://github.com/WintonCentre/predict-prostate/blob/761f20b554d9d3021320fd59cf9a73ece02b32b5/src/predict_prostate/state/config.cljs
- https://github.com/WintonCentre/predict-prostate/blob/761f20b554d9d3021320fd59cf9a73ece02b32b5/src/predict_prostate/content.cljs
- https://doi.org/10.1371/journal.pmed.1002758

[RIGHTS-SCOPE.md](../RIGHTS-SCOPE.md) · [test receipts](../evidence/)
