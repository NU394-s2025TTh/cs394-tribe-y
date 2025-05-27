// import React from 'react';
import styles from './qaStyles.module.css';

interface Result {
    query: string;
    expected: string;
    actual: string;
    matched: string;
    similarity: number;
    correct: boolean;
  }
  
  export default function MatchTable({ results }: { results: Result[] }) {
    return (
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Query</th>
            <th>Expected</th>
            <th>Actual</th>
            <th>Matched</th>
            <th>Score</th>
            <th>✅</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={i}>
              <td>{r.query}</td>
              <td>{r.expected}</td>
              <td>{r.actual}</td>
              <td>{r.matched}</td>
              <td>{r.similarity.toFixed(2)}</td>
              <td>{r.correct ? '✔️' : '❌'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }