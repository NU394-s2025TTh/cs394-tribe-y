// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import { Route, Routes } from 'react-router-dom';
import ColoredBoxes from './components/ColoredBoxes';

export function App() {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={<ColoredBoxes />}
        />
      </Routes>
    </div>
  );
}

export default App;
