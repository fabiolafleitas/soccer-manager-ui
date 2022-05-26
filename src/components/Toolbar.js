import React from 'react';
import Icon from './UI/Icon';
import styles from './Toolbar.module.css';

export default function Toolbar() {
  return (
    <div className={styles.toolbar}>
      <ul>
        <li>
          <button className={styles.toolbarBtn}>
            <Icon />
          </button>
          <button className={styles.toolbarBtn}>
            <Icon color="red" />
          </button>
          <button className={styles.toolbarBtn}>
            <Icon type="ball" color="black" />
          </button>
        </li>
      </ul>
    </div>
  );
}