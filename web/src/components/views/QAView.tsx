import React from 'react';
import EvaluateAllButton from '../QA_components/EvaluateAllButton';
import TestMatchButton from '../QA_components/TestMatchButton';
import styles from '../QA_components/qaStyles.module.css';

export const QAView: React.FC = () => {
  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          🧠 Query Matching Evaluation
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          This view uses an LLM to perform fuzzy matching between user queries and a known FAQ dataset. Use the tools below to evaluate all queries or test an individual match.
        </p>
      </header>

      <div className={styles.container}>
        <div className={styles.buttonGroup}>
            <TestMatchButton />
            <EvaluateAllButton />
        </div>
      </div>
    </div>
  );
};