/// web/src/app/components/EvaluateAllButton.tsx
import React, { useState } from 'react';
import extractedQueries from '../../data/extracted_queries.json';
import expectedAnswers from '../../data/qa_pairs.json';
import { matchQueryToFAQs } from '../../lib/faqMatcher';
import MatchTable from './MatchTable';

export default function EvaluateAllButton() {
  const [results, setResults] = useState<any[]>([]);
  const [accuracy, setAccuracy] = useState<number | null>(null);

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
    setAccuracy((correct / evalResults.length) * 100);
  };

  return (
    <div className="eval-block">
      <button onClick={handleClick}>📊 Evaluate All Queries</button>
      {accuracy !== null && (
        <p>✅ Accuracy: {accuracy.toFixed(1)}%</p>
      )}
      {results.length > 0 && <MatchTable results={results} />}
    </div>
  );
}