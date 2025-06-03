/// web/src/app/components/EvaluateAllButton.tsx
import { useState, ChangeEvent } from 'react';
import extractedQueries from '../../data/extracted_queries.json';
import rawExpected from '../../data/qa_pairs.json';
import { matchQueryToFAQs } from '../../lib/faqMatcher';
import MatchTable from './MatchTable';
import styles from './qaStyles.module.css';

const defaultExpectedAnswers: Record<string, string> = rawExpected;

export default function EvaluateAllButton() {
  const [results, setResults] = useState<any[]>([]);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [expectedAnswers, setExpectedAnswers] = useState<
    Record<string, string>
  >(defaultExpectedAnswers);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        // Accept either an object ({"q": "a"}) or array of {query, answer}
        let qaMap: Record<string, string> = {};
        if (Array.isArray(json)) {
          for (const item of json) {
            if (
              typeof item.query === 'string' &&
              typeof item.answer === 'string'
            ) {
              qaMap[item.query] = item.answer;
            }
          }
        } else if (typeof json === 'object' && json !== null) {
          qaMap = json;
        }
        if (Object.keys(qaMap).length === 0) {
          setUploadError('No valid QA pairs found in file.');
          return;
        }
        setExpectedAnswers(qaMap);
      } catch (err) {
        setUploadError('Invalid JSON file.');
      }
    };
    reader.onerror = () => setUploadError('Error reading file.');
    reader.readAsText(file);
  };

  const handleClick = async () => {
    const evalResults = [];
    let correct = 0;

    for (const item of extractedQueries) {
      const expected = expectedAnswers[item.query];
      if (!expected) continue;

      const match = await matchQueryToFAQs(item.query);
      const isCorrect = match.answer.trim() === expected.trim();

      if (isCorrect) correct++;

      evalResults.push({
        query: item.query,
        expected,
        actual: item.answer,
        matched: match.answer,
        similarity: match.similarity,
        correct: isCorrect,
      });
    }

    setResults(evalResults);
    setAccuracy(
      evalResults.length > 0 ? (correct / evalResults.length) * 100 : null
    );
  };

  return (
    <div className="eval-block flex flex-col items-center gap-4">
      <label className="flex flex-col items-center cursor-pointer">
        <span className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
          Upload custom <code>qa_pairs.json</code> (optional)
        </span>
        <input
          type="file"
          accept=".json,application/json"
          onChange={handleFileUpload}
          className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          data-testid="qa-upload-input"
        />
      </label>
      {uploadError && (
        <div className="text-red-600 dark:text-red-400 text-sm">
          {uploadError}
        </div>
      )}
      <button
        onClick={handleClick}
        className={styles.button}
        data-testid="evaluate-btn"
      >
        📊 Evaluate All Queries
      </button>
      {accuracy !== null && <p>✅ Accuracy: {accuracy.toFixed(1)}%</p>}
      {results.length > 0 && <MatchTable results={results} />}
    </div>
  );
}
