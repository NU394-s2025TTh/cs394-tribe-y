import faqs from '../data/qa_pairs.json';

export async function matchQueryToFAQs(query: string) {
  const corpus = Object.keys(faqs);

  const res = await fetch('http://localhost:8000/match', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, corpus }),
  });

  const data = await res.json();

  return {
    question: data.matched,
    similarity: data.score,
    answer: faqs[data.matched as keyof typeof faqs],
  };
}


