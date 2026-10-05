# PREDICT Prostate · 生存率

PREDICT Prostate 1.1を用い、根治的治療を行う場合と行わない場合の生存率・死亡率を比較します。このツールは治療を選択しません。

## 方法と版

PREDICT Prostate 1.1 · BRCA/PPC model; pinned official source 761f20b5 (2026-07-30)

## 入力

- **診断時の年齢** (`age`, `num`) — 歳／年 [35–95]
- **生検または治療前のPSA** (`psa`, `num`) — ng/mL [0–100]
- **臨床T病期** (`tStage`, `sel`)
  - `1`: T1
  - `2`: T2
  - `3`: T3
  - `4`: T4
- **組織学的グレードグループ** (`gradeGroup`, `sel`)
  - `1`: 1
  - `2`: 2
  - `3`: 3
  - `4`: 4
  - `5`: 5
- **診断前2年間の入院** (`hospitalAdmission`, `sel`)
  - `0`: いいえ
  - `1`: はい
- **モデルで定義された併存疾患** (`comorbidity`, `sel`)
  - `0`: いいえ
  - `1`: はい
- **BRCA1またはBRCA2の変異** (`brca`, `sel`)
  - `0`: 陰性または未検査
  - `1`: 陽性
- **生検データの有無** (`biopsyAvailable`, `sel`)
  - `0`: いいえ
  - `1`: はい
- **採取した生検コア数** (`coresTaken`, `num`) — コア [1–100]
- **前立腺癌を含むコア数** (`coresInvolved`, `num`) — コア [1–100]
- **転移性疾患の有無** (`metastasis`, `sel`)
  - `0`: いいえ
  - `1`: はい
- **導管内癌または浸潤性篩状成分** (`intraductalOrCribriform`, `sel`)
  - `0`: いいえ
  - `1`: はい
- **診断後の年数** (`years`, `sel`)
  - `10`: 10 歳／年
  - `15`: 15 歳／年

## 限界と検討

新たに診断された非転移性前立腺癌の男性で、保存的管理と根治的治療の両方が適切な選択肢である場合に用います。コホートの推定は個人の転帰を保証しません。治療の害や生活の質はモデル化していません。画面は35–95歳、PSA 0–100 ng/mL、10年または15年の予測に対応します。翻訳によって他国向けにモデルが再較正されるわけではありません。

技術的確認は実施済み。臨床および専門家による言語レビューは未実施です。

導管内癌または篩状成分がある場合は、その大きさ、広がり、グレードへの反映、生検部位を考慮します。顕著な場合は慎重に解釈するか、結果を使用しないでください。

技術的な確認には合成データを使用しています。独立した臨床レビューと専門家による翻訳レビューは実施されていません。

## 合成データで実行

```sh
node cli.cjs examples/input.json ja
```

## 結果

- `conservativeSurvivalPercent`: 保存的管理 (%)
- `radicalSurvivalPercent`: 根治的治療 (%)
- `absoluteSurvivalDifferencePercentagePoints`: 生存率の絶対差（パーセントポイント） (パーセントポイント)
- `effectLowerDifferencePercentagePoints`: 根治的治療の効果範囲 (パーセントポイント)
- `effectUpperDifferencePercentagePoints`: 根治的治療の効果範囲 (パーセントポイント)
- `prostateCancerDeathWithoutRadicalPercent`: 前立腺癌死亡率 (%)
- `otherDeathWithoutRadicalPercent`: その他の原因による死亡率 (%)
- `positiveCorePercent`: 陽性コアの割合 (%)
- `biopsyImputed`: 生検データなし：モデルは陽性コアの平均割合を使用します。

## 出典と権利

- https://github.com/WintonCentre/predict-prostate
- https://github.com/WintonCentre/predict-prostate/blob/761f20b554d9d3021320fd59cf9a73ece02b32b5/src/predict_prostate/models/prostate_release.cljs
- https://github.com/WintonCentre/predict-prostate/blob/761f20b554d9d3021320fd59cf9a73ece02b32b5/src/predict_prostate/state/config.cljs
- https://github.com/WintonCentre/predict-prostate/blob/761f20b554d9d3021320fd59cf9a73ece02b32b5/src/predict_prostate/content.cljs
- https://doi.org/10.1371/journal.pmed.1002758

[RIGHTS-SCOPE.md](../RIGHTS-SCOPE.md) · [test receipts](../evidence/)
