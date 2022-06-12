import React from 'react';
import styles from './ArrowsMenu.module.css';

export default function ArrowsMenu(props) {
  const {element} = props;
  const {position: {x, y}} = element;

  const handleArrowClick = (event, arrow) => {
    event.stopPropagation();
    props.onArrowClick(arrow, y, x);
  }

  const handleRemoveElement = (event) => {
    event.stopPropagation();
    props.onElementRemove(y, x);
  }

  const getActiveClass = (arrow) => {
    if(element.attributes.arrow === 0){
      return '';
    }
    return element.attributes.arrow === arrow ? styles.active : '';
  }

  return (
    <>
      {props.show && <div className={styles.container}>
        <ul className={styles.menu}>
          <li className={`${styles.item} ${getActiveClass('topLeft')}`}>
            <button onClick={(event) => handleArrowClick(event, 'topLeft')}>↖</button>
          </li>
          <li className={`${styles.item} ${getActiveClass('top')}`}>
            <button onClick={(event) => handleArrowClick(event, 'top')}>↑</button>
          </li>
          <li className={`${styles.item} ${getActiveClass('topRight')}`}>
            <button onClick={(event) => handleArrowClick(event, 'topRight')}>↗</button>
          </li>
          <li className={`${styles.item} ${getActiveClass('left')}`}>
            <button onClick={(event) => handleArrowClick(event, 'left')}>←</button>
          </li>
          <li className={`${styles.item} ${getActiveClass('right')}`}>
            <button onClick={(event) => handleArrowClick(event, 'right')}>→</button>
          </li>
          <li className={`${styles.item} ${getActiveClass('bottomLeft')}`}>
            <button onClick={(event) => handleArrowClick(event, 'bottomLeft')}>↙</button>
          </li>
          <li className={`${styles.item} ${getActiveClass('bottom')}`}>
            <button onClick={(event) => handleArrowClick(event, 'bottom')}>↓</button>
          </li>
          <li className={`${styles.item} ${getActiveClass('bottomRight')}`}>
            <button onClick={(event) => handleArrowClick(event, 'bottomRight')}>↘</button>
          </li>
          <li className={styles.item}>
            <button onClick={(event) => handleRemoveElement(event)}>🗑️</button>
          </li>
        </ul>
      </div>}
    </>
  );
}
