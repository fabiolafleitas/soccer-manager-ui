import React, { useState } from 'react';
import Field from './components/Field';
import Toolbar from './components/Toolbar';
import Board from './components/Board';
import Sequence from './components/Sequence';
import './App.css';
import { mockGroup1Data } from './data/groupData';

const untitledGroup = {
  name: 'Untitled',
  tactics: [{
    sequence: 0,
    elements: []
  }]
};

function App() {
  const [selectedItem, setSelectedItem] = useState('');
  const [isResetSelected, setIsResetSelected] = useState(false);
  const [tacticGroup, setTacticGroup] = useState(untitledGroup);
  const [selectedSequence, setSelectedSequence] = useState(0);

  const handleItemSelection = (item) => {
    setSelectedItem(item);
  }

  const handleIsResetClick = () => {
    setIsResetSelected(true);
  }

  const handleTacticSelection = (tacticId) => {
    if(!tacticId){
      setTacticGroup(untitledGroup);
      return;
    }

    if(tacticId !== tacticGroup.id){
      setTimeout(() => {
        const fetchedGroup = mockGroup1Data;
        setTacticGroup(fetchedGroup);
      }, 2000);
    }
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
    });
  }
  
  const handleIsResetRestart = () => {
    setIsResetSelected(false);
  }

  const handleSequenceSelection = (sequence) => {
    setSelectedSequence(sequence);
  }

  const handleNewSequence = () => {
    setTacticGroup({
      ...tacticGroup,
      tactics: [
        ...tacticGroup.tactics,
        {
          sequence: tacticGroup.tactics.length,
          elements: []
        }
      ]
    });
  }

  return (
    <div className="main-container">
      <Toolbar selectedItem={selectedItem}
              tacticGroupName={tacticGroup.name}
              onItemClick={handleItemSelection}
              onResetClick={handleIsResetClick}
              onTacticClick={handleTacticSelection} />
      <div className="field-container">
        <Field />
        <Board selectedItem={selectedItem} 
              isReset={isResetSelected}
              tacticGroup={tacticGroup}
              tacticSequence={selectedSequence}
              onElementAdd={handleElementAdd} 
              onResetRestart={handleIsResetRestart} />
      </div>
      <Sequence tacticSequence={selectedSequence}
                tacticsLength={tacticGroup.tactics.length}
                onSequenceSelected={handleSequenceSelection}
                onNewSequenceAdded={handleNewSequence} />
    </div>
  );
}

export default App;
