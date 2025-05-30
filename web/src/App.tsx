import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { Header } from './components/Header';
import { ThemeProvider } from './context/ThemeContext';
import { JsonDataProvider } from './context/JsonDataContext';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <ThemeProvider>
      <JsonDataProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <Dashboard sidebarOpen={sidebarOpen} />
        </div>
      </JsonDataProvider>
    </ThemeProvider>
  );
}

export default App;