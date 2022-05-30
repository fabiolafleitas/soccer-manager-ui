import React, { useState } from 'react';
import Field from './components/Field';
import Toolbar from './components/Toolbar';
import Board from './components/Board';
import './App.css';

function App() {
  const [selectedItem, setSelectedItem] = useState('');
  const [isResetSelected, setIsResetSelected] = useState(false);

  const handleItemSelection = (item) => {
    setSelectedItem(item);
  }

  const handleIsResetClick = () => {
    setIsResetSelected(true);
  }

  const handleIsResetRestart = () => {
    setIsResetSelected(false);
  }

  return (
    <div className="main-container">
      <Toolbar selectedItem={selectedItem} 
              onItemClick={handleItemSelection} 
              onResetClick={handleIsResetClick} />
      <div className="field-container">
        <Field />
        <Board selectedItem={selectedItem} isReset={isResetSelected} 
              onResetRestart={handleIsResetRestart} />
      </div>
    </div>
  );
}

export default App;
