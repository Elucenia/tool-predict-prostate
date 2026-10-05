# PREDICT Prostate · sopravvivenza

Confronta le stime di sopravvivenza e mortalità con e senza trattamento radicale mediante PREDICT Prostate 1.1. Lo strumento non sceglie un trattamento.

## Metodo ed edizione

PREDICT Prostate 1.1 · BRCA/PPC model; pinned official source 761f20b5 (2026-07-30)

## Dati in ingresso

- **Età alla diagnosi** (`age`, `num`) — anni [35–95]
- **PSA prima della biopsia o del trattamento** (`psa`, `num`) — ng/mL [0–100]
- **Stadio clinico T** (`tStage`, `sel`)
  - `1`: T1
  - `2`: T2
  - `3`: T3
  - `4`: T4
- **Gruppo di grado istologico** (`gradeGroup`, `sel`)
  - `1`: 1
  - `2`: 2
  - `3`: 3
  - `4`: 4
  - `5`: 5
- **Ricovero ospedaliero nei due anni precedenti** (`hospitalAdmission`, `sel`)
  - `0`: No
  - `1`: Sì
- **Comorbilità definita dal modello** (`comorbidity`, `sel`)
  - `0`: No
  - `1`: Sì
- **Variante BRCA1 o BRCA2** (`brca`, `sel`)
  - `0`: Negativo o non testato
  - `1`: Positivo
- **Dati della biopsia disponibili** (`biopsyAvailable`, `sel`)
  - `0`: No
  - `1`: Sì
- **Frustoli bioptici prelevati** (`coresTaken`, `num`) — frustoli [1–100]
- **Frustoli con carcinoma prostatico** (`coresInvolved`, `num`) — frustoli [1–100]
- **Malattia metastatica** (`metastasis`, `sel`)
  - `0`: No
  - `1`: Sì
- **Carcinoma intraduttale o componente cribriforme invasiva** (`intraductalOrCribriform`, `sel`)
  - `0`: No
  - `1`: Sì
- **Anni dalla diagnosi** (`years`, `sel`)
  - `10`: 10 anni
  - `15`: 15 anni

## Limiti e revisione

Per uomini con nuova diagnosi di carcinoma prostatico non metastatico quando gestione conservativa e radicale sono entrambe appropriate. Le stime delle coorti non garantiscono l’esito individuale. Danni e qualità di vita non sono modellati. L’interfaccia ammette 35–95 anni, PSA 0–100 ng/mL e proiezioni a 10 o 15 anni. La traduzione non ricalibra il modello per un altro Paese.

Verifiche tecniche disponibili; revisione clinica e linguistica professionale non eseguite.

Un componente intraduttale o cribriforme richiede di considerare dimensioni, estensione, attribuzione del grado e sedi bioptiche. Se significativo, interpretare con cautela o non utilizzare il risultato.

Le verifiche tecniche usano dati sintetici. Non sono state eseguite una revisione clinica indipendente e una revisione professionale delle traduzioni.

## Eseguire con dati sintetici

```sh
node cli.cjs examples/input.json it
```

## Risultati

- `conservativeSurvivalPercent`: Gestione conservativa (%)
- `radicalSurvivalPercent`: Trattamento radicale (%)
- `absoluteSurvivalDifferencePercentagePoints`: Differenza assoluta di sopravvivenza (punti percentuali) (punti percentuali)
- `effectLowerDifferencePercentagePoints`: Intervallo dell’effetto del trattamento radicale (punti percentuali)
- `effectUpperDifferencePercentagePoints`: Intervallo dell’effetto del trattamento radicale (punti percentuali)
- `prostateCancerDeathWithoutRadicalPercent`: Mortalità per carcinoma prostatico (%)
- `otherDeathWithoutRadicalPercent`: Mortalità per altre cause (%)
- `positiveCorePercent`: Proporzione di frustoli positivi (%)
- `biopsyImputed`: Dati bioptici assenti: il modello usa la proporzione media di frustoli positivi.

## Fonte e diritti

- https://github.com/WintonCentre/predict-prostate
- https://github.com/WintonCentre/predict-prostate/blob/761f20b554d9d3021320fd59cf9a73ece02b32b5/src/predict_prostate/models/prostate_release.cljs
- https://github.com/WintonCentre/predict-prostate/blob/761f20b554d9d3021320fd59cf9a73ece02b32b5/src/predict_prostate/state/config.cljs
- https://github.com/WintonCentre/predict-prostate/blob/761f20b554d9d3021320fd59cf9a73ece02b32b5/src/predict_prostate/content.cljs
- https://doi.org/10.1371/journal.pmed.1002758

[RIGHTS-SCOPE.md](../RIGHTS-SCOPE.md) · [test receipts](../evidence/)
