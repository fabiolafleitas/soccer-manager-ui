import React, { useState } from 'react';
import Icon from './UI/Icon';
import ball from '../assets/images/ball.png';
import styles from './Toolbar.module.css';

export default function Toolbar(props) {
  const {selectedItem, tacticGroupName} = props;
  const [savedTactics, setSaveTactics] = useState([]);

  const handleItemSelection = (item) => {
    props.onItemClick(item);
  }

  const handleResetClick = () => {
    props.onResetClick();
  }

  return (
    <div className={styles.toolbar}>
      <ul>
        <li>
          <h3>Soccer Manager</h3>
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
          <h4 className={`${tacticGroupName === 'Untitled' ? styles.unsaved : ''}`}>
            {tacticGroupName}
            <span>*</span>
          </h4>
        </li>
        <li>
          <button className={styles.toolbarBtn} title="Save">
            <Icon type="save" color="black" />
          </button>
        </li>
        <li>
          <div className={`${styles.dropdown} ${savedTactics.length === 0 ? styles.disabled : ''}`}>
            <button className={styles.toolbarBtn} disabled={savedTactics.length === 0}>
              <Icon type="list" color="black" />
            </button>
            <div className={styles.dropdownContent}>
              <button className={styles.toolbarBtn}>Saved Tactic 1</button>
              <button className={styles.toolbarBtn}>Saved Tactic 2</button>
              <button className={styles.toolbarBtn}>Saved Tactic 3</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}