# PREDICT Prostate · survie

Comparez les estimations de survie et de mortalité avec et sans traitement radical selon PREDICT Prostate 1.1. Cet outil ne choisit pas de traitement.

## Méthode et édition

PREDICT Prostate 1.1 · BRCA/PPC model; pinned official source 761f20b5 (2026-07-30)

## Entrées

- **Âge au diagnostic** (`age`, `num`) — ans [35–95]
- **PSA avant biopsie ou traitement** (`psa`, `num`) — ng/mL [0–100]
- **Stade clinique T** (`tStage`, `sel`)
  - `1`: T1
  - `2`: T2
  - `3`: T3
  - `4`: T4
- **Groupe de grade histologique** (`gradeGroup`, `sel`)
  - `1`: 1
  - `2`: 2
  - `3`: 3
  - `4`: 4
  - `5`: 5
- **Hospitalisation au cours des deux années précédentes** (`hospitalAdmission`, `sel`)
  - `0`: Non
  - `1`: Oui
- **Comorbidité définie par le modèle** (`comorbidity`, `sel`)
  - `0`: Non
  - `1`: Oui
- **Variant BRCA1 ou BRCA2** (`brca`, `sel`)
  - `0`: Négatif ou non testé
  - `1`: Positif
- **Données de biopsie disponibles** (`biopsyAvailable`, `sel`)
  - `0`: Non
  - `1`: Oui
- **Carottes de biopsie prélevées** (`coresTaken`, `num`) — carottes [1–100]
- **Carottes contenant un cancer de la prostate** (`coresInvolved`, `num`) — carottes [1–100]
- **Maladie métastatique** (`metastasis`, `sel`)
  - `0`: Non
  - `1`: Oui
- **Carcinome intracanalaire ou contingent cribriforme invasif** (`intraductalOrCribriform`, `sel`)
  - `0`: Non
  - `1`: Oui
- **Années après le diagnostic** (`years`, `sel`)
  - `10`: 10 ans
  - `15`: 15 ans

## Limites et révision

Pour les hommes récemment diagnostiqués avec un cancer de la prostate non métastatique lorsque les prises en charge conservatrice et radicale sont toutes deux appropriées. Les estimations de cohortes ne garantissent pas le devenir individuel. Les effets indésirables et la qualité de vie ne sont pas modélisés. L’interface couvre 35–95 ans, un PSA de 0–100 ng/mL et des projections à 10 ou 15 ans. La traduction ne recalibre pas le modèle pour un autre pays.

Vérifications techniques disponibles ; aucune révision clinique ou linguistique professionnelle effectuée.

Un contingent intracanalaire ou cribriforme nécessite de considérer sa taille, son étendue, son attribution de grade et les sites biopsiés. S’il est significatif, interprétez avec prudence ou n’utilisez pas le résultat.

Les vérifications techniques utilisent des données synthétiques. La révision clinique indépendante et la révision professionnelle des traductions n’ont pas été effectuées.

## Exécuter avec des données synthétiques

```sh
node cli.cjs examples/input.json fr
```

## Résultats

- `conservativeSurvivalPercent`: Prise en charge conservatrice (%)
- `radicalSurvivalPercent`: Traitement radical (%)
- `absoluteSurvivalDifferencePercentagePoints`: Différence absolue de survie (points de pourcentage) (points de pourcentage)
- `effectLowerDifferencePercentagePoints`: Intervalle de l’effet du traitement radical (points de pourcentage)
- `effectUpperDifferencePercentagePoints`: Intervalle de l’effet du traitement radical (points de pourcentage)
- `prostateCancerDeathWithoutRadicalPercent`: Mortalité par cancer de la prostate (%)
- `otherDeathWithoutRadicalPercent`: Mortalité d’autres causes (%)
- `positiveCorePercent`: Proportion de carottes positives (%)
- `biopsyImputed`: Sans données de biopsie : le modèle utilise la proportion moyenne de carottes positives.

## Source et droits

- https://github.com/WintonCentre/predict-prostate
- https://github.com/WintonCentre/predict-prostate/blob/761f20b554d9d3021320fd59cf9a73ece02b32b5/src/predict_prostate/models/prostate_release.cljs
- https://github.com/WintonCentre/predict-prostate/blob/761f20b554d9d3021320fd59cf9a73ece02b32b5/src/predict_prostate/state/config.cljs
- https://github.com/WintonCentre/predict-prostate/blob/761f20b554d9d3021320fd59cf9a73ece02b32b5/src/predict_prostate/content.cljs
- https://doi.org/10.1371/journal.pmed.1002758

[RIGHTS-SCOPE.md](../RIGHTS-SCOPE.md) · [test receipts](../evidence/)
