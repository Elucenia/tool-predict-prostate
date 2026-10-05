# PREDICT Prostate · survival

Compare survival and mortality estimates with and without radical treatment using PREDICT Prostate 1.1. The tool does not choose a treatment.

## Method and edition

PREDICT Prostate 1.1 · BRCA/PPC model; pinned official source 761f20b5 (2026-07-30)

## Inputs

- **Age at diagnosis** (`age`, `num`) — years [35–95]
- **PSA before biopsy or treatment** (`psa`, `num`) — ng/mL [0–100]
- **Clinical T stage** (`tStage`, `sel`)
  - `1`: T1
  - `2`: T2
  - `3`: T3
  - `4`: T4
- **Histological grade group** (`gradeGroup`, `sel`)
  - `1`: 1
  - `2`: 2
  - `3`: 3
  - `4`: 4
  - `5`: 5
- **Hospital admission in the preceding two years** (`hospitalAdmission`, `sel`)
  - `0`: No
  - `1`: Yes
- **Model-defined comorbidity** (`comorbidity`, `sel`)
  - `0`: No
  - `1`: Yes
- **BRCA1 or BRCA2 variant** (`brca`, `sel`)
  - `0`: Negative or untested
  - `1`: Positive
- **Biopsy data available** (`biopsyAvailable`, `sel`)
  - `0`: No
  - `1`: Yes
- **Biopsy cores taken** (`coresTaken`, `num`) — cores [1–100]
- **Cores containing prostate cancer** (`coresInvolved`, `num`) — cores [1–100]
- **Metastatic disease** (`metastasis`, `sel`)
  - `0`: No
  - `1`: Yes
- **Intraductal carcinoma or invasive cribriform component** (`intraductalOrCribriform`, `sel`)
  - `0`: No
  - `1`: Yes
- **Years after diagnosis** (`years`, `sel`)
  - `10`: 10 years
  - `15`: 15 years

## Limits and review

For newly diagnosed men with non-metastatic prostate cancer when conservative and radical management are both appropriate options. Cohort estimates cannot guarantee an individual outcome. Harms and quality of life are not modeled. The interface supports ages 35–95, PSA 0–100 ng/mL and 10- or 15-year projections. Translation does not recalibrate the model for another country.

Technical checks available; clinical and professional linguistic review have not been performed.

An intraductal or cribriform component requires consideration of its size, extent, grade assignment and biopsy sites. If significant, interpret with caution or do not use the output.

Technical checks use synthetic data. Independent clinical review and professional translation review have not been performed.

## Run with synthetic data

```sh
node cli.cjs examples/input.json en
```

## Results

- `conservativeSurvivalPercent`: Conservative management (%)
- `radicalSurvivalPercent`: Radical treatment (%)
- `absoluteSurvivalDifferencePercentagePoints`: Absolute survival difference (percentage points) (percentage points)
- `effectLowerDifferencePercentagePoints`: Radical treatment effect interval (percentage points)
- `effectUpperDifferencePercentagePoints`: Radical treatment effect interval (percentage points)
- `prostateCancerDeathWithoutRadicalPercent`: Prostate cancer mortality (%)
- `otherDeathWithoutRadicalPercent`: Mortality from other causes (%)
- `positiveCorePercent`: Proportion of positive cores (%)
- `biopsyImputed`: No biopsy data: the model uses the average proportion of positive cores.

## Source and rights

- https://github.com/WintonCentre/predict-prostate
- https://github.com/WintonCentre/predict-prostate/blob/761f20b554d9d3021320fd59cf9a73ece02b32b5/src/predict_prostate/models/prostate_release.cljs
- https://github.com/WintonCentre/predict-prostate/blob/761f20b554d9d3021320fd59cf9a73ece02b32b5/src/predict_prostate/state/config.cljs
- https://github.com/WintonCentre/predict-prostate/blob/761f20b554d9d3021320fd59cf9a73ece02b32b5/src/predict_prostate/content.cljs
- https://doi.org/10.1371/journal.pmed.1002758

[RIGHTS-SCOPE.md](../RIGHTS-SCOPE.md) · [test receipts](../evidence/)
