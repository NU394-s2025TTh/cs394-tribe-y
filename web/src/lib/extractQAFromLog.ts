export function extractQAFromLog(jsonData: any): { query: string; answer: string }[] {
    const qaPairs: { query: string; answer: string }[] = [];
  
    // ✅ Normalize input
    const traces = Array.isArray(jsonData) ? jsonData : jsonData.data;
    if (!Array.isArray(traces)) {
      console.warn('[extractQAFromLog] Unexpected format — no array found');
      return qaPairs;
    }
  
    for (const trace of traces) {
      const spans = trace.spans || [];
      let query: string | undefined;
      let answer: string | undefined;
  
      for (const span of spans) {
        const op = span.operationName;
  
        if (op.includes("Query from user")) {
          query = op.replace(/.*Query from user.*--/, '').trim();
        }
  
        if (op.includes("Output for Chat")) {
          answer = op.replace(/.*Output for Chat:/, '').trim();
        }
      }
  
      if (query && answer) {
        qaPairs.push({ query, answer });
      }
    }
  
    console.log(`[extractQAFromLog] Finished with ${qaPairs.length} Q&A pairs`);
    return qaPairs;
  }
  