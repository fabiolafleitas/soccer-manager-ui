import React from 'react';
import Field from './components/Field';
import Toolbar from './components/Toolbar';
import Board from './components/Board';
import './App.css';

function App() {
  return (
    <div className="main-container">
      <Toolbar />
      <div className="field-container">
        <Field />
        <Board />
      </div>
    </div>
  );
}

export default App;
