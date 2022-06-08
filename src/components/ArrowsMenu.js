import React from 'react';
import styles from './ArrowsMenu.module.css';

export default function ArrowsMenu(props) {
  const {row, column} = props;

  const handleArrowClick = (event, arrow) => {
    event.stopPropagation();
    props.onArrowClick(arrow, row, column);
  }

  return (
    <>
      {props.show && <div className={styles.container}>
        <ul className={styles.menu}>
          <li className={styles.item}><button onClick={(event) => handleArrowClick(event, 'topLeft')}>↖</button></li>
          <li className={styles.item}><button onClick={(event) => handleArrowClick(event, 'top')}>↑</button></li>
          <li className={styles.item}><button onClick={(event) => handleArrowClick(event, 'topRight')}>↗</button></li>
          <li className={styles.item}><button onClick={(event) => handleArrowClick(event, 'left')}>←</button></li>
          <li className={styles.item}><button onClick={(event) => handleArrowClick(event, 'right')}>→</button></li>
          <li className={styles.item}><button onClick={(event) => handleArrowClick(event, 'bottomLeft')}>↙</button></li>
          <li className={styles.item}><button onClick={(event) => handleArrowClick(event, 'bottom')}>↓</button></li>
          <li className={styles.item}><button onClick={(event) => handleArrowClick(event, 'bottomRight')}>↘</button></li>
          <li className={styles.item}><button onClick={(event) => handleArrowClick(event, 'topLeft')}>🗑️</button></li>
        </ul>
      </div>}
    </>
  );
}
