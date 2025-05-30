import rawFaqs from '../data/qa_pairs.json';

const faqs: Record<string, string> = rawFaqs;

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
    answer: faqs[data.matched], // ✅ 没问题
  };
}