# PREDICT Prostate · supervivencia

Compare estimaciones de supervivencia y mortalidad con y sin tratamiento radical mediante PREDICT Prostate 1.1. La herramienta no elige un tratamiento.

## Método y edición

PREDICT Prostate 1.1 · BRCA/PPC model; pinned official source 761f20b5 (2026-07-30)

## Entradas

- **Edad al diagnóstico** (`age`, `num`) — años [35–95]
- **PSA antes de la biopsia o del tratamiento** (`psa`, `num`) — ng/mL [0–100]
- **Estadio clínico T** (`tStage`, `sel`)
  - `1`: T1
  - `2`: T2
  - `3`: T3
  - `4`: T4
- **Grupo de grado histológico** (`gradeGroup`, `sel`)
  - `1`: 1
  - `2`: 2
  - `3`: 3
  - `4`: 4
  - `5`: 5
- **Ingreso hospitalario en los dos años anteriores** (`hospitalAdmission`, `sel`)
  - `0`: No
  - `1`: Sí
- **Comorbilidad definida por el modelo** (`comorbidity`, `sel`)
  - `0`: No
  - `1`: Sí
- **Variante BRCA1 o BRCA2** (`brca`, `sel`)
  - `0`: Negativo o no realizado
  - `1`: Positivo
- **Datos de biopsia disponibles** (`biopsyAvailable`, `sel`)
  - `0`: No
  - `1`: Sí
- **Cilindros de biopsia obtenidos** (`coresTaken`, `num`) — cilindros [1–100]
- **Cilindros con cáncer de próstata** (`coresInvolved`, `num`) — cilindros [1–100]
- **Enfermedad metastásica** (`metastasis`, `sel`)
  - `0`: No
  - `1`: Sí
- **Carcinoma intraductal o componente cribiforme invasivo** (`intraductalOrCribriform`, `sel`)
  - `0`: No
  - `1`: Sí
- **Años desde el diagnóstico** (`years`, `sel`)
  - `10`: 10 años
  - `15`: 15 años

## Límites y revisión

Para hombres recién diagnosticados con cáncer de próstata no metastásico cuando el manejo conservador y el radical son opciones apropiadas. Las estimaciones de cohortes no garantizan el desenlace individual. No se modelan daños ni calidad de vida. La interfaz admite 35–95 años, PSA de 0–100 ng/mL y proyecciones de 10 o 15 años. Traducir no recalibra el modelo para otro país.

Comprobaciones técnicas disponibles; sin revisión clínica ni lingüística profesional.

Un componente intraductal o cribiforme requiere considerar tamaño, extensión, asignación de grado y sitios de biopsia. Si es significativo, interprete con cautela o no utilice el resultado.

Las comprobaciones técnicas utilizan datos sintéticos. No se han realizado una revisión clínica independiente ni una revisión profesional de las traducciones.

## Ejecutar con datos sintéticos

```sh
node cli.cjs examples/input.json es
```

## Resultados

- `conservativeSurvivalPercent`: Manejo conservador (%)
- `radicalSurvivalPercent`: Tratamiento radical (%)
- `absoluteSurvivalDifferencePercentagePoints`: Diferencia absoluta de supervivencia (puntos porcentuales) (puntos porcentuales)
- `effectLowerDifferencePercentagePoints`: Intervalo del efecto del tratamiento radical (puntos porcentuales)
- `effectUpperDifferencePercentagePoints`: Intervalo del efecto del tratamiento radical (puntos porcentuales)
- `prostateCancerDeathWithoutRadicalPercent`: Mortalidad por cáncer de próstata (%)
- `otherDeathWithoutRadicalPercent`: Mortalidad por otras causas (%)
- `positiveCorePercent`: Proporción de cilindros positivos (%)
- `biopsyImputed`: Sin datos de biopsia: el modelo utiliza la proporción media de cilindros positivos.

## Fuente y derechos

- https://github.com/WintonCentre/predict-prostate
- https://github.com/WintonCentre/predict-prostate/blob/761f20b554d9d3021320fd59cf9a73ece02b32b5/src/predict_prostate/models/prostate_release.cljs
- https://github.com/WintonCentre/predict-prostate/blob/761f20b554d9d3021320fd59cf9a73ece02b32b5/src/predict_prostate/state/config.cljs
- https://github.com/WintonCentre/predict-prostate/blob/761f20b554d9d3021320fd59cf9a73ece02b32b5/src/predict_prostate/content.cljs
- https://doi.org/10.1371/journal.pmed.1002758

[RIGHTS-SCOPE.md](../RIGHTS-SCOPE.md) · [test receipts](../evidence/)
