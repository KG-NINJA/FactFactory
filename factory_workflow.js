#!/usr/bin/env node

/**
 * FactFactory: AI情報収集ファクトリーの軽量シミュレーター
 */

const presets = {
  "open-data": {
    sources: ["政府統計API", "オープンデータポータル", "研究プレプリント"],
  },
  "social-beat": {
    sources: ["技術SNS", "コミュニティDiscordログ", "求人情報"],
  },
};

const alternativeAngles = [
  "公開API→スクレイピングに切替",
  "ニュースフィード→企業IRログに切替",
  "一次情報→専門家インタビューに切替",
];

const args = parseFlags(process.argv.slice(2));
const preset = presets[args.source] || presets["open-data"];
const ticks = Math.max(1, args.ticks || 5);

let failureStreak = 0;
let totalScore = 0;

console.log("=== FactFactory Run ===");
console.log(`Preset: ${args.source || "open-data"}`);
console.log(`Ticks: ${ticks}`);

for (let i = 0; i < ticks; i++) {
  const context = runTick(i + 1, preset.sources);
  totalScore += context.score;

  if (context.score < 40) {
    failureStreak++;
    console.log(`⚠️  Condition Red: スコア${context.score}`);
    if (failureStreak === 2) {
      console.log("🔥 Super Mode突入！代替案3件を提示:");
      alternativeAngles.forEach((idea, idx) => {
        console.log(`   ${idx + 1}. ${idea}`);
      });
      if (args["auto-heal"]) {
        healPipeline(preset.sources);
      }
    }
    if (failureStreak === 5) {
      console.log("🚨 Game Over回避アルゴリズム発動 → Alternative Angleへ強制切替");
      preset.sources.reverse();
      failureStreak = 0;
    }
  } else {
    failureStreak = 0;
  }
}

console.log(`Total Score: ${totalScore.toFixed(1)}`);
console.log("=======================");

/**
 * 1ティック分の情報ラインを実行
 */
function runTick(tick, sources) {
  // 日本語コメント必須: 各ステーションの処理をまとめる
  const gathered = gatherStage(tick, sources);
  const refined = refineStage(gathered);
  const scored = scoreStage(refined);
  publishStage(scored);
  learnStage(scored);
  return scored;
}

function gatherStage(tick, sources) {
  // 日本語コメント: 情報源を順番に取り出し擬似データを生成
  return sources.map((source) => ({
    source,
    freshness: randomRange(0.2, 1),
    valueDensity: randomRange(0.1, 1),
    tick,
  }));
}

function refineStage(entries) {
  // 日本語コメント: ノイズを除くために閾値を設ける
  return entries.filter((entry) => entry.valueDensity > 0.3);
}

function scoreStage(entries) {
  // 日本語コメント: 価値×鮮度×信頼度でスコア化
  const scoredEntries = entries.map((entry) => {
    const trust = randomRange(0.5, 1);
    const score = entry.valueDensity * entry.freshness * trust * 100;
    return { ...entry, trust, score };
  });

  const score = scoredEntries.reduce((sum, e) => sum + e.score, 0);
  console.log(`Tick result → Entries: ${scoredEntries.length}, Score: ${score.toFixed(1)}`);
  return { entries: scoredEntries, score };
}

function publishStage(context) {
  // 日本語コメント: 高スコアの情報だけを出荷ログに残す
  const highlights = context.entries.filter((entry) => entry.score > 60);
  highlights.forEach((entry) => {
    console.log(`🟦 Publish: ${entry.source} | ${entry.score.toFixed(1)}`);
  });
}

function learnStage(context) {
  // 日本語コメント: フィードバックに応じて価値閾値を調整する（ここではログのみ）
  const average = context.entries.length ? context.score / context.entries.length : 0;
  console.log(`📘 Learn: 平均スコア ${average.toFixed(1)} を次ループの初期重みへ反映`);
}

function healPipeline(sources) {
  // 日本語コメント: 自動回復でソース順序をシャッフル
  sources.sort(() => Math.random() - 0.5);
  console.log("🛠️  パイプラインを再配線しました（自動ヒール）");
}

function parseFlags(argv) {
  // 日本語コメント: シンプルなフラグ解析
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) {
      const key = argv[i].replace(/^--/, "");
      const next = argv[i + 1];
      if (!next || next.startsWith("--")) {
        flags[key] = true;
      } else {
        flags[key] = isNaN(Number(next)) ? next : Number(next);
        i++;
      }
    }
  }
  return flags;
}

function randomRange(min, max) {
  // 日本語コメント: 乱数を指定レンジで生成
  return Math.random() * (max - min) + min;
}
