# PREDICT Prostate · 生存率

使用PREDICT Prostate 1.1比较接受和不接受根治性治疗的生存率及死亡率估计。本工具不会选择治疗。

## 方法与版本

PREDICT Prostate 1.1 · BRCA/PPC model; pinned official source 761f20b5 (2026-07-30)

## 输入

- **诊断时年龄** (`age`, `num`) — 岁／年 [35–95]
- **活检或治疗前的PSA** (`psa`, `num`) — 纳克/毫升 [0–100]
- **临床T分期** (`tStage`, `sel`)
  - `1`: T1
  - `2`: T2
  - `3`: T3
  - `4`: T4
- **组织学分级组** (`gradeGroup`, `sel`)
  - `1`: 1
  - `2`: 2
  - `3`: 3
  - `4`: 4
  - `5`: 5
- **此前两年内是否住院** (`hospitalAdmission`, `sel`)
  - `0`: 否
  - `1`: 是
- **模型定义的合并症** (`comorbidity`, `sel`)
  - `0`: 否
  - `1`: 是
- **BRCA1或BRCA2变异** (`brca`, `sel`)
  - `0`: 阴性或未检测
  - `1`: 阳性
- **是否有活检数据** (`biopsyAvailable`, `sel`)
  - `0`: 否
  - `1`: 是
- **取得的活检组织条数** (`coresTaken`, `num`) — 组织条 [1–100]
- **含前列腺癌的组织条数** (`coresInvolved`, `num`) — 组织条 [1–100]
- **是否存在转移性疾病** (`metastasis`, `sel`)
  - `0`: 否
  - `1`: 是
- **导管内癌或浸润性筛状成分** (`intraductalOrCribriform`, `sel`)
  - `0`: 否
  - `1`: 是
- **诊断后的年数** (`years`, `sel`)
  - `10`: 10 岁／年
  - `15`: 15 岁／年

## 限制与审查

适用于新诊断的非转移性前列腺癌男性，且保守和根治性管理均是合适选项。队列估计不能保证个人结局。模型不计算治疗损害或生活质量。界面支持35–95岁、PSA 0–100纳克/毫升及10或15年预测。翻译不会为其他国家重新校准模型。

已进行技术检查；尚未进行临床或专业语言审查。

存在导管内或筛状成分时，应考虑其大小、范围、分级归属及活检部位。若该成分显著，应谨慎解读或不使用结果。

技术检查使用合成数据。尚未开展独立临床审查和专业翻译审查。

## 使用合成数据运行

```sh
node cli.cjs examples/input.json zh
```

## 结果

- `conservativeSurvivalPercent`: 保守管理 (%)
- `radicalSurvivalPercent`: 根治性治疗 (%)
- `absoluteSurvivalDifferencePercentagePoints`: 生存率绝对差（百分点） (百分点)
- `effectLowerDifferencePercentagePoints`: 根治性治疗效应区间 (百分点)
- `effectUpperDifferencePercentagePoints`: 根治性治疗效应区间 (百分点)
- `prostateCancerDeathWithoutRadicalPercent`: 前列腺癌死亡率 (%)
- `otherDeathWithoutRadicalPercent`: 其他原因死亡率 (%)
- `positiveCorePercent`: 阳性组织条比例 (%)
- `biopsyImputed`: 没有活检数据：模型使用阳性组织条的平均比例。

## 来源与权利

- https://github.com/WintonCentre/predict-prostate
- https://github.com/WintonCentre/predict-prostate/blob/761f20b554d9d3021320fd59cf9a73ece02b32b5/src/predict_prostate/models/prostate_release.cljs
- https://github.com/WintonCentre/predict-prostate/blob/761f20b554d9d3021320fd59cf9a73ece02b32b5/src/predict_prostate/state/config.cljs
- https://github.com/WintonCentre/predict-prostate/blob/761f20b554d9d3021320fd59cf9a73ece02b32b5/src/predict_prostate/content.cljs
- https://doi.org/10.1371/journal.pmed.1002758

[RIGHTS-SCOPE.md](../RIGHTS-SCOPE.md) · [test receipts](../evidence/)
