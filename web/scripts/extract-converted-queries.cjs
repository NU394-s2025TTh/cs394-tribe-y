// extract-converted-queries.cjs
const fs = require('fs');
const path = require('path');

// === CONFIG ===
const inputPath = path.join(__dirname, '../src/data/converted_log.json');
const extractedOutputPath = path.join(__dirname, '../src/data/extracted_from_converted.json');
const qaOutputPath = path.join(__dirname, '../src/data/qa_pairs_from_converted.json');

console.log('[extract-converted-queries] Starting...');

const raw = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
const traces = raw.data || [];

const transactions = [];

for (const trace of traces) {
  const spans = trace.spans || [];
  const traceID = trace.traceID;

  let query = null;
  let answer = null;
  let responseTimeMs = null;

  for (const span of spans) {
    const name = span.operationName;

    if (!name) continue;

    // Find the query span
    if (name.includes('[BPAgent][inference] Query from user')) {
      query = name;
    }

    // Find the response time
    if (name.includes('[SlashGPTServer][inference] Response time:')) {
      const match = name.match(/Response time: ([\d.]+)/);
      if (match) {
        responseTimeMs = parseFloat(match[1]) * 1000;
      }
    }

    // Find the LLM's final answer
    if (name.includes('[BPAgent][run_proc] Output for Chat:')) {
      const match = name.match(/Output for Chat: (.*)/);
      if (match) {
        answer = match[1].trim();
      }
    }
  }

  if (query && answer) {
    transactions.push({ traceID, query, answer, responseTimeMs });
    console.log(`✅ Saved trace ${traceID}`);
  } else {
    console.log(`⚠️ Skipped trace ${traceID} — missing query or answer`);
  }
}

const qaPairs = {};
transactions.forEach(t => {
  qaPairs[t.query] = t.answer;
});

fs.writeFileSync(extractedOutputPath, JSON.stringify(transactions, null, 2));
fs.writeFileSync(qaOutputPath, JSON.stringify(qaPairs, null, 2));

console.log(`\n[extract-converted-queries] Done. Extracted ${transactions.length} Q&A pairs.`);
console.log(`→ Saved to:\n- ${extractedOutputPath}\n- ${qaOutputPath}`);
