import React, { useState } from 'react';
import Field from './components/Field';
import Toolbar from './components/Toolbar';
import Board from './components/Board';
import Sequence from './components/Sequence';
import Toast from './components/UI/Toast';
import './App.css';
import { getTacticGroup, saveTacticGroup, updateTacticGroup, getMockGroup } from './services/tactics.service';

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
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [tacticTouched, setTacticTouched] = useState(false);

  const handleItemSelection = (item) => {
    setSelectedItem(item);
  }

  const handleResetClick = () => {
    if(tacticGroup.tactics[selectedSequence].elements.length > 0){
      setTacticTouched(true);
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
  }

  const handleNewName = (name) => {
    setTacticTouched(true);
    setTacticGroup({...tacticGroup, name});
  }

  const handleTacticSelection = (tacticId) => {
    setSelectedSequence(0);
    setTacticTouched(false);
    
    if(!tacticId){
      setTacticGroup(untitledGroup);
      return;
    }

    if(tacticId !== tacticGroup._id){
      if(tacticId === 'A1'){
        const group1 = getMockGroup();
        setTacticGroup(group1);
      }else{
        getTacticGroup(tacticId)
        .then(({data}) => {
          setTacticGroup(data);
        });
      }
    }
  }

  const handleTacticSave = () => {
    setSaving(true);
    if(tacticGroup._id === undefined){
      saveTacticGroup(tacticGroup)
      .then(({data}) => {
        setTacticGroup(data);
        setTacticTouched(false);
        setToastMessage('save done!');
      })
      .catch(error => setToastMessage(error.message))
      .finally(() => {setSaving(false)});
    } else {
      updateTacticGroup(tacticGroup._id, tacticGroup)
      .then(({data}) => {
        setTacticGroup(data);
        setTacticTouched(false);
        setToastMessage('update done!');
      })
      .catch(error => setToastMessage(error.message))
      .finally(() => {setSaving(false)});;
    }
  }
  
  const handleElementAdd = (sequence, element) => {
    setTacticTouched(true);
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

  const handleElementRemove = (index) => {
    setTacticTouched(true);
    setTacticGroup({
      ...tacticGroup,
      tactics: tacticGroup.tactics.map(tactic => {
        if(tactic.sequence !== selectedSequence){
          return tactic
        }
        return {
          ...tactic,
          elements: tactic.elements.filter(element => element.index !== index)
        }
      })
    });
  }

  const handleOnElementDrop = (result) => {
    setTacticTouched(true);
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

  const handleArrowAdd = (arrow, index) => {
    setTacticTouched(true);
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

  const handleArrowRemove = (index) => {
    setTacticTouched(true);
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
                  arrow: null
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
    setTacticTouched(true);
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

  const unsavedTactic = !tacticGroup._id || tacticTouched;

  return (
    <>
      <div className="main-container">
        <Toolbar selectedItem={selectedItem}
                tacticGroupName={tacticGroup.name}
                onItemClick={handleItemSelection}
                onResetClick={handleResetClick}
                onSaveNewName={handleNewName}
                onTacticClick={handleTacticSelection}
                onTacticSaveClick={handleTacticSave}
                unsavedTactic={unsavedTactic}
                isSaving={saving} />
        <div className="field-container">
          <Field />
          <Board selectedItem={selectedItem}
                tacticGroup={tacticGroup}
                tacticSequence={selectedSequence}
                onElementAdd={handleElementAdd}
                onElementRemove={handleElementRemove}
                onElementDrop={handleOnElementDrop}
                onArrowAdd={handleArrowAdd}
                onArrowRemove={handleArrowRemove} />
          {saving && <div className="loading">Saving...</div>}
        </div>
        <Sequence tacticSequence={selectedSequence}
                  tacticsLength={tacticGroup.tactics.length}
                  onSequenceSelected={handleSequenceSelection}
                  onNewSequenceAdded={handleNewSequence} />
      </div>
      <Toast show={toastMessage.length > 0} 
            updateShowToast={setToastMessage}
            message={toastMessage}>
      </Toast>
    </>
  );
}

export default App;
