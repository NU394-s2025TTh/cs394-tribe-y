// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import LogDashboard from './components/LogDashboard';
import './app.module.css';

// Sample log data
const sampleLogData = {
  data: [
    {
      traceID: "f695ebb9366dd278c2342d2196a4e051",
      spans: [
        {
          traceID: "f695ebb9366dd278c2342d2196a4e051",
          spanID: "a32d4a3b5561c3aa",
          operationName: "POST",
          startTime: 1746639244898835,
          duration: 602159,
          tags: [
            {
              key: "http.method",
              type: "string",
              value: "POST"
            },
            {
              key: "http.url",
              type: "string",
              value: "https://ensemble.tne.ai/v1/chat/completions"
            },
            {
              key: "http.status_code",
              type: "int64",
              value: 200
            }
          ]
        },
        {
          traceID: "f695ebb9366dd278c2342d2196a4e051",
          spanID: "eb85ba291f58242a",
          operationName: "POST",
          startTime: 1746639245525828,
          duration: 168091,
          tags: [
            {
              key: "http.method",
              type: "string",
              value: "POST"
            },
            {
              key: "http.url",
              type: "string",
              value: "https://ensemble.tne.ai/v1/embeddings"
            },
            {
              key: "http.status_code",
              type: "int64",
              value: 200
            }
          ]
        }
      ],
      processes: {
        "p1": {
          serviceName: "knowledge",
          tags: [
            {
              key: "telemetry.sdk.language",
              type: "string",
              value: "python"
            }
          ]
        }
      }
    }
  ]
};

export function App() {
  return (
    <LogDashboard data={sampleLogData} />
  );
}

export default App;
