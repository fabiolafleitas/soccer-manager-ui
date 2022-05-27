import React, { useState } from 'react';
import Field from './components/Field';
import Toolbar from './components/Toolbar';
import Board from './components/Board';
import './App.css';

function App() {
  const [selectedItem, setSelectedItem] = useState('');

  const handleItemSelection = (item) => {
    setSelectedItem(item);
  }

  return (
    <div className="main-container">
      <Toolbar selectedItem={selectedItem} onItemClick={handleItemSelection} />
      <div className="field-container">
        <Field />
        <Board selectedItem={selectedItem} />
      </div>
    </div>
  );
}

export default App;
