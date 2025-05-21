// scripts/convert-faqs.ts
//npm install xlsx
// run with this: npx ts-node scripts/convert-faqs.ts
// raw data in public/data and output in src/data

// scripts/convert-faqs.ts
// npm install xlsx


const fs   = require('fs')
const path = require('path')
const XLSX = require('xlsx')

const RAW_DIR     = path.join(__dirname, '..', 'public', 'data')
const OUT_DIR     = path.join(__dirname, '..', 'src', 'data')
const EXCEL_FILE  = 'echo_acceptance_tests.xlsx'
const OUTPUT_JSON = 'faqs_dict.json'

// ensure output dir exists
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true })
}

// load sheet as array-of-arrays
const workbook = XLSX.readFile(path.join(RAW_DIR, EXCEL_FILE))
const sheet    = workbook.Sheets[workbook.SheetNames[0]]
const rows     = XLSX.utils.sheet_to_json(sheet, {
  header:     1,
  defval:     '',
  blankrows:  false,
  raw:        false,
}) as any[][]

// find the header row index by looking for “Questions” + “Expected output”
const headerIndex = rows.findIndex(r =>
  Array.isArray(r) &&
  r.includes('Questions') &&
  r.includes('Expected output')
)

if (headerIndex < 0) {
  throw new Error('Could not find a header row containing "Questions" and "Expected output"')
}

const headerRow = rows[headerIndex] as string[]
const qCol       = headerRow.indexOf('Questions')
const aCol       = headerRow.indexOf('Expected output')

// build the QA map
const qaMap: Record<string,string> = {}
for (let i = headerIndex + 1; i < rows.length; i++) {
  const row = rows[i] as any[]
  const question = String(row[qCol] || '').trim()
  const answer   = String(row[aCol] || '').trim()
  if (question) {
    qaMap[question] = answer
  }
}

// write out faqs_dict.json
fs.writeFileSync(
  path.join(OUT_DIR, OUTPUT_JSON),
  JSON.stringify(qaMap, null, 2),
  'utf-8'
)
console.log(`Wrote ${Object.keys(qaMap).length} Q→A pairs to ${OUTPUT_JSON}`)
// -- for CSV (unchanged) --
const CSV_FILE = 'log_data.csv';
const CSV_OUT  = 'log_data.json';

const csvWb     = XLSX.readFile(path.join(RAW_DIR, CSV_FILE));
const csvSheet  = csvWb.Sheets[csvWb.SheetNames[0]];
const logData   = XLSX.utils.sheet_to_json(csvSheet, { defval: '' });

fs.writeFileSync(
  path.join(OUT_DIR, CSV_OUT),
  JSON.stringify(logData, null, 2),
  'utf-8'
);
console.log(`Wrote ${logData.length} rows to ${CSV_OUT}`);


