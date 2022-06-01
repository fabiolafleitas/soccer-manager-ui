import React, { useState } from 'react';
import Field from './components/Field';
import Toolbar from './components/Toolbar';
import Board from './components/Board';
import './App.css';

function App() {
  const [selectedItem, setSelectedItem] = useState('');
  const [isResetSelected, setIsResetSelected] = useState(false);
  const [tacticGroup, setTacticGroup] = useState({
    name: 'Untitled',
    tactics: [{
      sequence: 0,
      elements: []
    }]
  });

  const handleItemSelection = (item) => {
    setSelectedItem(item);
  }

  const handleIsResetClick = () => {
    setIsResetSelected(true);
  }

  const handleIsResetRestart = () => {
    setIsResetSelected(false);
  }

  const handleElementAdd = (sequence, element) => {
    setTacticGroup({
      ...tacticGroup,
      tactics: tacticGroup.tactics.map(tactic => {
        if(tactic.sequence !== sequence){
          return tactic
        }
        return {
          ...tactic,
          elements: [...tactic.elements, element] 
        }
      })
    })
  }

  return (
    <div className="main-container">
      <Toolbar selectedItem={selectedItem}
              tacticGroupName={tacticGroup.name}
              onItemClick={handleItemSelection} 
              onResetClick={handleIsResetClick} />
      <div className="field-container">
        <Field />
        <Board selectedItem={selectedItem} 
              isReset={isResetSelected}
              tacticGroup={tacticGroup}
              onElementAdd={handleElementAdd} 
              onResetRestart={handleIsResetRestart} />
      </div>
    </div>
  );
}

export default App;
