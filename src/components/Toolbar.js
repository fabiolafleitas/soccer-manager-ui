import React, { useEffect, useState } from 'react';
import Icon from './UI/Icon';
import EditableInput from './UI/EditableInput';
import ball from '../assets/images/ball.png';
import styles from './Toolbar.module.css';
import { getTacticGroups } from '../services/tactics.service';

export default function Toolbar(props) {
  const {selectedItem, tacticGroupName, unsavedTactic, isSaving} = props;
  const [savedTactics, setSaveTactics] = useState([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    getTacticGroups()
      .then((result) => {
        setSaveTactics(result.data)
      })
      .catch((error) => {
        const fetchTactics = [
          {
            name: "Group 1",
            _id: "A1"
          }
        ];
        setSaveTactics(fetchTactics);
    });
  }, [unsavedTactic]);

  const handleItemSelection = (item) => {
    props.onItemClick(item);
  }

  const handleResetClick = () => {
    props.onResetClick();
  }

  const handleTitleSave = (newTitle) => {
    props.onSaveNewName(newTitle);
  }

  const handleTacticClick = (tacticId) => {
    setEditMode(false);
    props.onTacticClick(tacticId);
  }

  const handleSaveTacticClick = () => {
    setEditMode(false);
    props.onTacticSaveClick();
  }

  return (
    <div className={styles.toolbar}>
      <ul>
        <li>
          <h1>Soccer Manager</h1>
        </li>
        <li>
          <button className={`${styles.toolbarBtn} ${selectedItem === 'team1' ? `${styles.active} ${styles.activeBlue}` : ''}`} 
                  onClick={() => handleItemSelection('team1')}>
            <Icon />
          </button>
        </li>
        <li>
          <button className={`${styles.toolbarBtn} ${selectedItem === 'team2' ? `${styles.active} ${styles.activeRed}` : ''}`}
                  onClick={() => handleItemSelection('team2')}>
            <Icon color="red" />
          </button>
        </li>
        <li>
          <button className={`${styles.toolbarBtn} ${selectedItem === 'ball' ? `${styles.active} ${styles.activeBall}` : ''}`}
                  onClick={() => handleItemSelection('ball')}>
            <img src={ball} alt="soccer ball" />
          </button>
        </li>
        <li>
          <button className={styles.toolbarBtn} title="Reset"
                  onClick={handleResetClick}>
            <Icon type="reset" color="black" />
          </button>
        </li>
      </ul>

      <ul className={styles.menu}>
        <li>
          <EditableInput 
              editMode={editMode}
              onSetEditMode={setEditMode}
              changeIndicator={unsavedTactic}
              onSave={handleTitleSave}>
            {tacticGroupName}
          </EditableInput>
        </li>
        <li>
          <button className={styles.toolbarBtn} disabled={isSaving || editMode} title="Save"
            onClick={() => handleSaveTacticClick()}>
            <Icon type="save" color="black" />
          </button>
        </li>
        <li>
          <div className={`${styles.dropdown} ${savedTactics.length === 0 ? styles.disabled : ''}`}>
            <button className={styles.toolbarBtn} disabled={savedTactics.length === 0}>
              <Icon type="list" color="black" />
            </button>
            <div className={styles.dropdownContent}>
              <button className={styles.toolbarBtn}
                onClick={() => handleTacticClick()}>
                  <i>Create New Tactic</i>
              </button>
              {savedTactics.map(tactic => (
                <button key={tactic._id} className={styles.toolbarBtn}
                        onClick={() => handleTacticClick(tactic._id)}>
                  {tactic.name}
                </button>
              ))}
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}