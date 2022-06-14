import React, {useState} from 'react';
import { useLayoutEffect } from 'react';
import styles from './EditableInput.module.css';

export default function EditableInput(props) {
  const { changeIndicator, children:initialValue } = props;

  const [editMode, setEditMode] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useLayoutEffect(() => {
    setEditMode(false);
  }, [initialValue]);

  const handleReadModeClick = () => {
    setEditMode(true);
    setInputValue(initialValue);
  }

  const handleInputSave = () => {
    setEditMode(false);
    inputValue !== initialValue && props.onSave(inputValue);
  }

  const handleInputCancel = () => {
    setEditMode(false);
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
