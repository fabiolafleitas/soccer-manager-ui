import React, { useState } from 'react';
import Field from './components/Field';
import Toolbar from './components/Toolbar';
import Board from './components/Board';
import Sequence from './components/Sequence';
import './App.css';
import { getTacticGroup, saveTacticGroup, updateTacticGroup } from './services/tactics.service';

const untitledGroup = {
  name: 'Untitled',
  tactics: [{
    sequence: 0,
    elements: []
  }]
};

function App() {
  const [selectedItem, setSelectedItem] = useState('');
  const [tacticGroup, setTacticGroup] = useState(untitledGroup);
  const [selectedSequence, setSelectedSequence] = useState(0);

  const handleItemSelection = (item) => {
    setSelectedItem(item);
  }

  const handleResetClick = () => {
    setTacticGroup({
      ...tacticGroup,
      tactics: tacticGroup.tactics.map(tactic => {
        if(tactic.sequence !== selectedSequence){
          return tactic
        }
        return {
          ...tactic,
          elements: [] 
        }
      })
    });
  }

  const handleTacticSelection = (tacticId) => {
    setSelectedSequence(0);
    if(!tacticId){
      setTacticGroup(untitledGroup);
      return;
    }

    if(tacticId !== tacticGroup._id){
      getTacticGroup(tacticId).then(({data}) => setTacticGroup(data));
    }
  }

  const handleTacticSave = () => {
    if(tacticGroup._id === undefined){
      saveTacticGroup(tacticGroup).then(() => console.log('save done!'));
    } else {
      console.log(tacticGroup);
      updateTacticGroup(tacticGroup._id, tacticGroup).then((result) => {
        console.log(result);
        console.log('update done!');
      })
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

  const handleArrowAdd = (arrow, index) => {
    setTacticGroup({
      ...tacticGroup,
      tactics: tacticGroup.tactics.map(tactic => {
        if(tactic.sequence !== selectedSequence){
          return tactic
        }
        return {
          ...tactic,
          elements: tactic.elements.map(
            element => {
              if(element.index !== index){
                return element;
              }
              return {
                ...element, 
                attributes: {
                  ...element.attributes,
                  arrow: arrow
                }
              }
            }
          )
        }
      })
    });
  }

  const handleSequenceSelection = (sequence) => {
    setSelectedSequence(sequence);
  }

  const handleNewSequence = () => {
    const newSequence = tacticGroup.tactics.length;
    setTacticGroup({
      ...tacticGroup,
      tactics: [
        ...tacticGroup.tactics,
        {
          sequence: newSequence,
          elements: []
        }
      ]
    });
    setSelectedSequence(newSequence);
  }

  const handleOnElementDrop = (result) => {
    setTacticGroup({
      ...tacticGroup,
      tactics: tacticGroup.tactics.map(tactic => {
        if(tactic.sequence !== selectedSequence){
          return tactic
        }
        return {
          ...tactic,
          elements: tactic.elements.map(
            element => {
              if(element.index !== result.sourceIndex){
                return element;
              }
              return {
                ...element,
                id: result.destIndex,
                index: result.destIndex,
                position: {
                  x: result.x,
                  y: result.y
                }
              }
            }
          )
        }
      })
    });
  }

  return (
    <div className="main-container">
      <Toolbar selectedItem={selectedItem}
              tacticGroupName={tacticGroup.name}
              onItemClick={handleItemSelection}
              onResetClick={handleResetClick}
              onTacticClick={handleTacticSelection}
              onTacticSaveClick={handleTacticSave} />
      <div className="field-container">
        <Field />
        <Board selectedItem={selectedItem}
              tacticGroup={tacticGroup}
              tacticSequence={selectedSequence}
              onElementAdd={handleElementAdd}
              onArrowAdd={handleArrowAdd}
              onElementDrop={handleOnElementDrop} />
      </div>
      <Sequence tacticSequence={selectedSequence}
                tacticsLength={tacticGroup.tactics.length}
                onSequenceSelected={handleSequenceSelection}
                onNewSequenceAdded={handleNewSequence} />
    </div>
  );
}

export default App;
