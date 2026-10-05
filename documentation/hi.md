# PREDICT Prostate · उत्तरजीविता

PREDICT Prostate 1.1 से रेडिकल उपचार के साथ और बिना जीवित रहने तथा मृत्यु के अनुमान तुलना करें। यह उपकरण उपचार नहीं चुनता।

## विधि और संस्करण

PREDICT Prostate 1.1 · BRCA/PPC model; pinned official source 761f20b5 (2026-07-30)

## इनपुट

- **निदान के समय आयु** (`age`, `num`) — वर्ष [35–95]
- **बायोप्सी या उपचार से पहले PSA** (`psa`, `num`) — नैनोग्राम/मिलीलीटर [0–100]
- **नैदानिक T अवस्था** (`tStage`, `sel`)
  - `1`: T1
  - `2`: T2
  - `3`: T3
  - `4`: T4
- **ऊतकवैज्ञानिक ग्रेड समूह** (`gradeGroup`, `sel`)
  - `1`: 1
  - `2`: 2
  - `3`: 3
  - `4`: 4
  - `5`: 5
- **पिछले दो वर्षों में अस्पताल में भर्ती** (`hospitalAdmission`, `sel`)
  - `0`: नहीं
  - `1`: हाँ
- **मॉडल में परिभाषित सहवर्ती रोग** (`comorbidity`, `sel`)
  - `0`: नहीं
  - `1`: हाँ
- **BRCA1 या BRCA2 वैरिएंट** (`brca`, `sel`)
  - `0`: नकारात्मक या जाँच नहीं हुई
  - `1`: सकारात्मक
- **बायोप्सी के आँकड़े उपलब्ध हैं** (`biopsyAvailable`, `sel`)
  - `0`: नहीं
  - `1`: हाँ
- **लिए गए बायोप्सी कोर** (`coresTaken`, `num`) — बायोप्सी कोर [1–100]
- **प्रोस्टेट कैंसर वाले कोर** (`coresInvolved`, `num`) — बायोप्सी कोर [1–100]
- **मेटास्टेटिक रोग** (`metastasis`, `sel`)
  - `0`: नहीं
  - `1`: हाँ
- **इंट्राडक्टल कार्सिनोमा या आक्रामक क्रिब्रिफॉर्म घटक** (`intraductalOrCribriform`, `sel`)
  - `0`: नहीं
  - `1`: हाँ
- **निदान के बाद वर्ष** (`years`, `sel`)
  - `10`: 10 वर्ष
  - `15`: 15 वर्ष

## सीमाएँ और समीक्षा

नए निदान वाले गैर-मेटास्टेटिक प्रोस्टेट कैंसर के पुरुषों के लिए, जब रूढ़िवादी और रेडिकल प्रबंधन दोनों उचित विकल्प हों। समूह के अनुमान व्यक्तिगत परिणाम की गारंटी नहीं देते। हानियाँ और जीवन की गुणवत्ता मॉडल में नहीं हैं। इंटरफ़ेस 35–95 वर्ष, PSA 0–100 नैनोग्राम/मिलीलीटर तथा 10 या 15 वर्ष के अनुमान स्वीकार करता है। अनुवाद दूसरे देश के लिए मॉडल का पुनःअंशांकन नहीं करता।

तकनीकी जाँच उपलब्ध है; नैदानिक और पेशेवर भाषाई समीक्षा नहीं हुई है।

इंट्राडक्टल या क्रिब्रीफॉर्म घटक होने पर उसका आकार, विस्तार, ग्रेड में समावेश और बायोप्सी स्थल देखें। यदि वह उल्लेखनीय हो, तो परिणाम सावधानी से समझें या उसका उपयोग न करें।

तकनीकी जाँच में कृत्रिम डेटा का उपयोग होता है। स्वतंत्र नैदानिक समीक्षा और पेशेवर अनुवाद समीक्षा नहीं की गई है।

## कृत्रिम डेटा के साथ चलाएँ

```sh
node cli.cjs examples/input.json hi
```

## परिणाम

- `conservativeSurvivalPercent`: रूढ़िवादी प्रबंधन (%)
- `radicalSurvivalPercent`: रेडिकल उपचार (%)
- `absoluteSurvivalDifferencePercentagePoints`: जीवित रहने में निरपेक्ष अंतर (प्रतिशत अंक) (प्रतिशत अंक)
- `effectLowerDifferencePercentagePoints`: रेडिकल उपचार के प्रभाव का अंतराल (प्रतिशत अंक)
- `effectUpperDifferencePercentagePoints`: रेडिकल उपचार के प्रभाव का अंतराल (प्रतिशत अंक)
- `prostateCancerDeathWithoutRadicalPercent`: प्रोस्टेट कैंसर से मृत्यु (%)
- `otherDeathWithoutRadicalPercent`: अन्य कारणों से मृत्यु (%)
- `positiveCorePercent`: पॉजिटिव कोर का अनुपात (%)
- `biopsyImputed`: बायोप्सी के आँकड़े नहीं हैं: मॉडल सकारात्मक कोर का औसत अनुपात उपयोग करता है।

## स्रोत और अधिकार

- https://github.com/WintonCentre/predict-prostate
- https://github.com/WintonCentre/predict-prostate/blob/761f20b554d9d3021320fd59cf9a73ece02b32b5/src/predict_prostate/models/prostate_release.cljs
- https://github.com/WintonCentre/predict-prostate/blob/761f20b554d9d3021320fd59cf9a73ece02b32b5/src/predict_prostate/state/config.cljs
- https://github.com/WintonCentre/predict-prostate/blob/761f20b554d9d3021320fd59cf9a73ece02b32b5/src/predict_prostate/content.cljs
- https://doi.org/10.1371/journal.pmed.1002758

[RIGHTS-SCOPE.md](../RIGHTS-SCOPE.md) · [test receipts](../evidence/)
