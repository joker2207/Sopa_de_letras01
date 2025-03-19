import React from 'react';
import './App.css';
import WordSearchGenerator from './components/WordSearchGenerator';
import ErrorBoundary from './ErrorBoundary';

function App() {
  return (
    <div className="App">
      <ErrorBoundary>
        <WordSearchGenerator />
      </ErrorBoundary>
    </div>
  );
}

export default App;