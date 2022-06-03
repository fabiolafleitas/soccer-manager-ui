import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Field from './components/Field';
import Toolbar from './components/Toolbar';
import Board from './components/Board';
import Sequence from './components/Sequence';
import './App.css';
import { mockGroup1Data } from './data/groupData';
import { getPostionFromXY } from './helpers/convert';

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
    const sourceX = +result.source.index;
    const sourceY = +result.source.droppableId.split('row')[1];
    const sourcePositionIndex = getPostionFromXY(sourceX, sourceY);
    
    const destinationX = +result.destination.index;
    const destinationY = +result.destination.droppableId.split('row')[1];
    const destPositionIndex = getPostionFromXY(destinationX, destinationY);
    
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
              if(element.index !== sourcePositionIndex){
                return element;
              }
              return {
                ...element, 
                index: destPositionIndex,
                position: {
                  ...element.position,
                  x: destinationX,
                  y: destinationY
                }
              }
            }
          )
        }
      })
    });
  }

  return (
    <DragDropContext onDragEnd={handleOnElementDrop}>
      <div className="main-container">
        <Toolbar selectedItem={selectedItem}
                tacticGroupName={tacticGroup.name}
                onItemClick={handleItemSelection}
                onResetClick={handleResetClick}
                onTacticClick={handleTacticSelection} />
        <div className="field-container">
          <Field />
          <Board selectedItem={selectedItem}
                tacticGroup={tacticGroup}
                tacticSequence={selectedSequence}
                onElementAdd={handleElementAdd} />
        </div>
        <Sequence tacticSequence={selectedSequence}
                  tacticsLength={tacticGroup.tactics.length}
                  onSequenceSelected={handleSequenceSelection}
                  onNewSequenceAdded={handleNewSequence} />
      </div>
    </DragDropContext>
  );
}

export default App;
