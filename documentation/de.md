# PREDICT Prostate · Überleben

Vergleichen Sie Überlebens- und Sterblichkeitsprognosen mit und ohne radikale Behandlung nach PREDICT Prostate 1.1. Das Werkzeug wählt keine Behandlung aus.

## Methode und Fassung

PREDICT Prostate 1.1 · BRCA/PPC model; pinned official source 761f20b5 (2026-07-30)

## Eingaben

- **Alter bei Diagnose** (`age`, `num`) — Jahre [35–95]
- **PSA vor Biopsie oder Behandlung** (`psa`, `num`) — ng/mL [0–100]
- **Klinisches T-Stadium** (`tStage`, `sel`)
  - `1`: T1
  - `2`: T2
  - `3`: T3
  - `4`: T4
- **Histologische Gradgruppe** (`gradeGroup`, `sel`)
  - `1`: 1
  - `2`: 2
  - `3`: 3
  - `4`: 4
  - `5`: 5
- **Stationäre Aufnahme in den letzten zwei Jahren** (`hospitalAdmission`, `sel`)
  - `0`: Nein
  - `1`: Ja
- **Im Modell definierte Begleiterkrankung** (`comorbidity`, `sel`)
  - `0`: Nein
  - `1`: Ja
- **BRCA1- oder BRCA2-Variante** (`brca`, `sel`)
  - `0`: Negativ oder nicht getestet
  - `1`: Positiv
- **Biopsiedaten verfügbar** (`biopsyAvailable`, `sel`)
  - `0`: Nein
  - `1`: Ja
- **Entnommene Biopsiestanzen** (`coresTaken`, `num`) — Stanzen [1–100]
- **Stanzen mit Prostatakrebs** (`coresInvolved`, `num`) — Stanzen [1–100]
- **Metastasierte Erkrankung** (`metastasis`, `sel`)
  - `0`: Nein
  - `1`: Ja
- **Intraduktales Karzinom oder invasiver kribriformer Anteil** (`intraductalOrCribriform`, `sel`)
  - `0`: Nein
  - `1`: Ja
- **Jahre nach Diagnose** (`years`, `sel`)
  - `10`: 10 Jahre
  - `15`: 15 Jahre

## Grenzen und Prüfung

Für Männer mit neu diagnostiziertem, nicht metastasiertem Prostatakrebs, wenn konservative und radikale Behandlung geeignete Optionen sind. Kohortenprognosen garantieren keinen individuellen Verlauf. Behandlungsschäden und Lebensqualität werden nicht modelliert. Die Oberfläche erlaubt 35–95 Jahre, PSA 0–100 ng/mL und Prognosen über 10 oder 15 Jahre. Eine Übersetzung kalibriert das Modell nicht für ein anderes Land.

Technische Prüfungen verfügbar; keine klinische oder fachsprachliche Prüfung erfolgt.

Bei intraduktalem oder kribriformem Anteil sind Größe, Ausmaß, Gradzuordnung und Biopsiestellen zu berücksichtigen. Bei ausgeprägtem Befund das Ergebnis vorsichtig interpretieren oder nicht verwenden.

Die technischen Prüfungen verwenden synthetische Daten. Eine unabhängige klinische Prüfung und eine professionelle Übersetzungsprüfung wurden nicht durchgeführt.

## Mit synthetischen Daten ausführen

```sh
node cli.cjs examples/input.json de
```

## Ergebnisse

- `conservativeSurvivalPercent`: Konservative Behandlung (%)
- `radicalSurvivalPercent`: Radikale Behandlung (%)
- `absoluteSurvivalDifferencePercentagePoints`: Absolute Überlebensdifferenz (Prozentpunkte) (Prozentpunkte)
- `effectLowerDifferencePercentagePoints`: Intervall des Effekts der radikalen Behandlung (Prozentpunkte)
- `effectUpperDifferencePercentagePoints`: Intervall des Effekts der radikalen Behandlung (Prozentpunkte)
- `prostateCancerDeathWithoutRadicalPercent`: Prostatakrebsspezifische Sterblichkeit (%)
- `otherDeathWithoutRadicalPercent`: Sterblichkeit durch andere Ursachen (%)
- `positiveCorePercent`: Anteil positiver Stanzen (%)
- `biopsyImputed`: Keine Biopsiedaten: Das Modell verwendet den mittleren Anteil positiver Stanzen.

## Quelle und Rechte

- https://github.com/WintonCentre/predict-prostate
- https://github.com/WintonCentre/predict-prostate/blob/761f20b554d9d3021320fd59cf9a73ece02b32b5/src/predict_prostate/models/prostate_release.cljs
- https://github.com/WintonCentre/predict-prostate/blob/761f20b554d9d3021320fd59cf9a73ece02b32b5/src/predict_prostate/state/config.cljs
- https://github.com/WintonCentre/predict-prostate/blob/761f20b554d9d3021320fd59cf9a73ece02b32b5/src/predict_prostate/content.cljs
- https://doi.org/10.1371/journal.pmed.1002758

[RIGHTS-SCOPE.md](../RIGHTS-SCOPE.md) · [test receipts](../evidence/)
