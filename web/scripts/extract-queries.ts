// extract-queries.ts
// Run with: npx ts-node web/scripts/extract-queries.ts

const fs = require('fs');
const path = require('path');

// interfaces for the data structures
interface LogEntry {
  timestamp: number;
  body?: string;
  trace_id?: string;
  otelTraceID?: string;
  [key: string]: any;
}

interface Transaction {
  query: string;
  startTime: string;
  endTime?: string;
  traceId?: string;
  answer: string | null;
  responseTimeMs: number | null;
  completed: boolean;
}

// Configure paths
const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const LOGS_FILE = 'log_data.json';
const OUTPUT_FILE = 'extracted_queries.json';

console.log('Starting query extraction from logs...');

// Ensure the data directory exists
if (!fs.existsSync(DATA_DIR)) {
  console.error(`Data directory not found: ${DATA_DIR}`);
  process.exit(1);
}

// Read the logs JSON file
let logs: LogEntry[] = [];
try {
  const logsPath = path.join(DATA_DIR, LOGS_FILE);
  const logsContent = fs.readFileSync(logsPath, 'utf-8');
  logs = JSON.parse(logsContent);
  console.log(`Read ${logs.length} log entries from ${LOGS_FILE}`);
} catch (error: unknown) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error(`Error reading logs file: ${errorMessage}`);
  process.exit(1);
}

// Sort logs by timestamp to ensure correct sequence
logs.sort((a: LogEntry, b: LogEntry) => a.timestamp - b.timestamp);

// Extract transactions and queries
const transactions: Transaction[] = [];
let currentTransaction: Transaction | null = null;

logs.forEach((entry: LogEntry) => {
  if (!entry.body) return;

  // Check for transaction start marker
  const startMatch = entry.body.match(
    /\[BPAgent\]\[inference\] Query from user .*?: .*? -- (.*?)$/
  );
  if (startMatch) {
    // Save previous transaction if exists
    if (currentTransaction) {
      transactions.push(currentTransaction);
    }

    // Start new transaction
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

  // If we're in a transaction, look for answer and end marker
  if (currentTransaction) {
    // Look for answers in "Received question" entries
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
            if (
              !currentTransaction.query ||
              currentTransaction.query.length === 0
            ) {
              currentTransaction.query = contextQuery;
            }

            currentTransaction.answer = cleanAnswer;
          }
        }
      }
    }
    // Check for transaction end marker
    const endMatch = entry.body.match(
      /\[SlashGPTServer\]\[inference\] Response time: ([\d.]+)/
    );
    if (endMatch) {
      currentTransaction.endTime = new Date(
        entry.timestamp * 1000
      ).toISOString();
      currentTransaction.responseTimeMs = parseFloat(endMatch[1]) * 1000; // Convert to milliseconds
      currentTransaction.completed = true;

      // Save and reset
      transactions.push(currentTransaction);
      currentTransaction = null;
    }
  }
});

if (currentTransaction) {
  transactions.push(currentTransaction);
}

const completedQueries: Record<string, string> = {};

transactions
  .filter((t) => t.completed && t.query && t.answer)
  .forEach((t) => {
    completedQueries[t.query] = t.answer || '';
  });

// Define output file names
const QUERIES_FILE = 'extracted_queries.json';
const CLEAN_QA_FILE = 'qa_pairs.json';

// Write output files
fs.writeFileSync(
  path.join(DATA_DIR, QUERIES_FILE),
  JSON.stringify(transactions, null, 2),
  'utf-8'
);

fs.writeFileSync(
  path.join(DATA_DIR, CLEAN_QA_FILE),
  JSON.stringify(completedQueries, null, 2),
  'utf-8'
);

console.log(
  `Extracted ${transactions.length} transactions (${
    Object.keys(completedQueries).length
  } complete Q&A pairs)`
);
console.log(`Results saved to:`);
console.log(`- ${QUERIES_FILE} (all transactions)`);
console.log(`- ${CLEAN_QA_FILE} (clean Q&A pairs)`);
