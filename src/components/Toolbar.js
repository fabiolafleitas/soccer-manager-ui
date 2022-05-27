import React from 'react';
import Icon from './UI/Icon';
import ball from '../assets/images/ball.png';
import styles from './Toolbar.module.css';

export default function Toolbar(props) {
  const {selectedItem} = props;

  const handleItemSelection = (item) => {
    props.onItemClick(item);
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
      </ul>
    </div>
  );
}