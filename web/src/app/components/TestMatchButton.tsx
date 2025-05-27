import React from 'react';
import { matchQueryToFAQs } from '../../lib/faqMatcher';

export default function TestMatchButton() {
  const handleClick = async () => {
    const result = await matchQueryToFAQs("How many crossbody bags are there?");
    alert(`🧠 Matched:\n${result.question}\nScore: ${result.similarity}\n\nAnswer: ${result.answer}`);
    console.log("Match Result:", result);
  };

  return <button onClick={handleClick}>🧪 Run LLM Match</button>;
}
