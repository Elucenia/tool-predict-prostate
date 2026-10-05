# PREDICT Prostate · sobrevida

Compare estimativas de sobrevida e mortalidade, com e sem tratamento radical, pelo método PREDICT Prostate 1.1. A ferramenta não escolhe um tratamento.

## Método e edição

PREDICT Prostate 1.1 · BRCA/PPC model; pinned official source 761f20b5 (2026-07-30)

## Entradas

- **Idade no diagnóstico** (`age`, `num`) — anos [35–95]
- **PSA antes da biópsia ou tratamento** (`psa`, `num`) — ng/mL [0–100]
- **Estádio clínico T** (`tStage`, `sel`)
  - `1`: T1
  - `2`: T2
  - `3`: T3
  - `4`: T4
- **Grupo de grau histológico** (`gradeGroup`, `sel`)
  - `1`: 1
  - `2`: 2
  - `3`: 3
  - `4`: 4
  - `5`: 5
- **Internação hospitalar nos dois anos anteriores** (`hospitalAdmission`, `sel`)
  - `0`: Não
  - `1`: Sim
- **Comorbidade definida pelo modelo** (`comorbidity`, `sel`)
  - `0`: Não
  - `1`: Sim
- **Variante BRCA1 ou BRCA2** (`brca`, `sel`)
  - `0`: Negativo ou não testado
  - `1`: Positivo
- **Dados da biópsia disponíveis** (`biopsyAvailable`, `sel`)
  - `0`: Não
  - `1`: Sim
- **Fragmentos de biópsia obtidos** (`coresTaken`, `num`) — fragmentos [1–100]
- **Fragmentos com câncer de próstata** (`coresInvolved`, `num`) — fragmentos [1–100]
- **Doença metastática** (`metastasis`, `sel`)
  - `0`: Não
  - `1`: Sim
- **Componente intraductal ou cribriforme invasivo** (`intraductalOrCribriform`, `sel`)
  - `0`: Não
  - `1`: Sim
- **Anos após o diagnóstico** (`years`, `sel`)
  - `10`: 10 anos
  - `15`: 15 anos

## Limites e revisão

Modelo para homens recém diagnosticados com câncer de próstata não metastático, quando manejo conservador e radical são opções apropriadas. As estimativas de coortes não garantem o desfecho individual. Não incluem danos ou qualidade de vida. Os limites da interface são 35–95 anos, PSA 0–100 ng/mL e projeções de 10 ou 15 anos. A tradução não recalibra o modelo por país.

Conferência técnica disponível; revisão clínica e linguística profissional não realizadas.

A presença de componente intraductal ou cribriforme requer interpretar tamanho, extensão, atribuição de grau e locais da biópsia. Na presença significativa, interprete com cautela ou não use o resultado.

Conferência técnica com dados sintéticos. Revisão clínica independente e revisão profissional das traduções não foram realizadas.

## Executar com dados sintéticos

```sh
node cli.cjs examples/input.json pt-BR
```

## Resultados

- `conservativeSurvivalPercent`: Manejo conservador (%)
- `radicalSurvivalPercent`: Tratamento radical (%)
- `absoluteSurvivalDifferencePercentagePoints`: Diferença absoluta de sobrevida (pontos percentuais) (pontos percentuais)
- `effectLowerDifferencePercentagePoints`: Intervalo de efeito do tratamento radical (pontos percentuais)
- `effectUpperDifferencePercentagePoints`: Intervalo de efeito do tratamento radical (pontos percentuais)
- `prostateCancerDeathWithoutRadicalPercent`: Mortalidade por câncer de próstata (%)
- `otherDeathWithoutRadicalPercent`: Mortalidade por outras causas (%)
- `positiveCorePercent`: Proporção de fragmentos positivos (%)
- `biopsyImputed`: Sem dados da biópsia: proporção média de fragmentos positivos usada pelo modelo.

## Fonte e direitos

- https://github.com/WintonCentre/predict-prostate
- https://github.com/WintonCentre/predict-prostate/blob/761f20b554d9d3021320fd59cf9a73ece02b32b5/src/predict_prostate/models/prostate_release.cljs
- https://github.com/WintonCentre/predict-prostate/blob/761f20b554d9d3021320fd59cf9a73ece02b32b5/src/predict_prostate/state/config.cljs
- https://github.com/WintonCentre/predict-prostate/blob/761f20b554d9d3021320fd59cf9a73ece02b32b5/src/predict_prostate/content.cljs
- https://doi.org/10.1371/journal.pmed.1002758

[RIGHTS-SCOPE.md](../RIGHTS-SCOPE.md) · [test receipts](../evidence/)
