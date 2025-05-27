// extract-queries.cjs
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const LOGS_FILE = 'log_data.json';
const OUTPUT_FILE = 'extracted_queries.json';

console.log('Starting query extraction from logs...');

if (!fs.existsSync(DATA_DIR)) {
  console.error(`Data directory not found: ${DATA_DIR}`);
  process.exit(1);
}

let logs = [];
try {
  const logsPath = path.join(DATA_DIR, LOGS_FILE);
  const logsContent = fs.readFileSync(logsPath, 'utf-8');
  logs = JSON.parse(logsContent);
  console.log(`Read ${logs.length} log entries from ${LOGS_FILE}`);
} catch (error) {
  console.error(`Error reading logs file: ${error.message}`);
  process.exit(1);
}

logs.sort((a, b) => a.timestamp - b.timestamp);

const transactions = [];
let currentTransaction = null;

logs.forEach(entry => {
  if (!entry.body) return;

  const startMatch = entry.body.match(
    /\[BPAgent\]\[inference\] Query from user .*?: .*? -- (.*?)$/
  );
  if (startMatch) {
    if (currentTransaction) transactions.push(currentTransaction);
    const userQuery = startMatch[1].trim();
    currentTransaction = {
      query: userQuery,
      startTime: new Date(entry.timestamp * 1000).toISOString(),
      traceId: entry.trace_id || entry.otelTraceID,
      answer: null,
      responseTimeMs: null,
      completed: false,
    };
    return;
  }

  if (currentTransaction) {
    if (entry.body.includes('[Assistant][call_llm] Received question:')) {
      const contextMatch = entry.body.match(/\[Context query: (.*?)\]/);
      const currentInputIndex = entry.body.indexOf('[Current input: ');
      if (currentInputIndex !== -1) {
        const lastBracketIndex = entry.body.lastIndexOf(']');
        if (lastBracketIndex > currentInputIndex) {
          const startIndex = currentInputIndex + '[Current input: '.length;
          const answer = entry.body.substring(startIndex, lastBracketIndex);
          const cleanAnswer = answer.replace(/\\n/g, '\n');
          if (contextMatch) {
            const contextQuery = contextMatch[1].trim();
            if (!currentTransaction.query.length) {
              currentTransaction.query = contextQuery;
            }
            currentTransaction.answer = cleanAnswer;
          }
        }
      }
    }

    const endMatch = entry.body.match(
      /\[SlashGPTServer\]\[inference\] Response time: ([\d.]+)/
    );
    if (endMatch) {
      currentTransaction.endTime = new Date(entry.timestamp * 1000).toISOString();
      currentTransaction.responseTimeMs = parseFloat(endMatch[1]) * 1000;
      currentTransaction.completed = true;
      transactions.push(currentTransaction);
      currentTransaction = null;
    }
  }
});

if (currentTransaction) {
  transactions.push(currentTransaction);
}

const completedQueries = {};
transactions
  .filter(t => t.completed && t.query && t.answer)
  .forEach(t => {
    completedQueries[t.query] = t.answer || '';
  });

const queriesPath = path.join(DATA_DIR, OUTPUT_FILE);
const cleanPath = path.join(DATA_DIR, 'qa_pairs.json');

fs.writeFileSync(queriesPath, JSON.stringify(transactions, null, 2), 'utf-8');
fs.writeFileSync(cleanPath, JSON.stringify(completedQueries, null, 2), 'utf-8');

console.log(
  `Extracted ${transactions.length} transactions (${Object.keys(completedQueries).length} Q&A pairs)`
);
console.log(`Wrote:`);
console.log(`- ${queriesPath}`);
console.log(`- ${cleanPath}`);
