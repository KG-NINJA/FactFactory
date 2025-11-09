# FactFactory

AIワークフローと工場系ゲームを融合した「無限情報収集ファクトリー」です。有用な情報を抽出し続けるほどスコアが伸び、ラインを最適化することで常時ハイスコアを狙えます。

## 核心コンセプト
- **情報ライン**: 収集（Gather）→整流（Refine）→評価（Score）→出荷（Publish）→リサイクル（Learn）の5段ステーションでループ。
- **ノード定義**: `factory_workflow.js` でノードと配管を記述し、CLIからシミュレーション可能。
- **無限ラン**: 新しい情報源を随時差し替え可能な設計で、古いノードを休止させながら常にフローを維持。

## ステーション詳細
1. **Gather**: RSS/API/クローラ系ソースをヒートマップで優先度管理。
2. **Refine**: LLM/ルールベースでノイズ除去。Condition Red時はダブル精査モード。
3. **Score**: 価値×鮮度×信頼度で加点。80点超でボーナスバッファに格納。
4. **Publish**: ナレッジグラフやダッシュボードへ配信し、エンジンに経験値を付与。
5. **Learn**: ユーザーフィードバックを次ループの初期重みに反映。

## Condition Red/スーパー モード
- テスト/検証2回連続失敗でCondition Red。`factory_workflow.js` は自動で「Super Mode突入！」をログ出力し、代替ソース案を3つ提示。
- 5回連続失敗で`Alternative Angle`に定義した別フローへ切替。

## 進捗とスコア
- `node scripts/pixel-progress.js --progress <0-100>` でピクセル進捗をSVG化。50%超で緑、80%超で金色ボーナス。
- `factory_workflow.js` 実行で最新スコアと情報価値ログが表示される。

## 使い方
```bash
node factory_workflow.js --ticks 5 --source "open-data"
```
- `--ticks`: ループ回数（デフォルト5）。  
- `--source`: 優先する情報ラインのプリセット名。  
- `--auto-heal`: Condition Red後に自動で代替ラインへ切り替える。

## 拡張アイデア
- Storybook UIを接続し、各ノードの状態をカード表示。  
- Jestでノード評価関数をユニットテスト化し、テスト緑＝Gameクリア扱い。  
- 価値算出式を`scoreFormula.js`に切り出してABテスト。

## 次アクション
1. ノード別に実データソースを接続。  
2. 収集結果を`/review`に送り、AIレビュー結果をスコアに反映。  
3. Plan更新とピクセル進捗の同期を継続。
