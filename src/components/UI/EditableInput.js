import React, {useState} from 'react';
import { useLayoutEffect } from 'react';
import styles from './EditableInput.module.css';

export default function EditableInput(props) {
  const { changeIndicator, children:initialValue, editMode, onSetEditMode } = props;

  const [inputValue, setInputValue] = useState('');

  useLayoutEffect(() => {
  }, [initialValue, onSetEditMode]);

  const handleReadModeClick = () => {
    onSetEditMode(true);
    setInputValue(initialValue);
  }

  const handleInputSave = () => {
    onSetEditMode(false);
    inputValue !== initialValue && props.onSave(inputValue);
  }

  const handleInputCancel = () => {
    onSetEditMode(false);
  }
  
  const classes = `${styles.editableInput} ${!editMode ? styles.plaintext : ''} ${changeIndicator ? styles.unsaved : ''}`

  return (
    <>
      {changeIndicator && <span>*</span>}
      <input type="text" value={editMode ? inputValue : initialValue} readOnly={!editMode}
        className={classes}
        onClick={handleReadModeClick}
        onChange={(event) => setInputValue(event.target.value)}
      />
      {editMode && 
        <>
          <button className={styles.inputBtn} onClick={handleInputSave}>&#10003;</button>
          <button className={styles.inputBtn} onClick={handleInputCancel}>&#10007;</button>
        </>
      }
    </>
  );
}
