import React, {useState} from 'react';
import styles from './Board.module.css';

export default function Board(props){
  const {selectedItem} = props;

  const [ocuppiedPlaces, setOcuppiedPlaces] = useState([]);

  /* Fixed board size 60 columns and 40 rows */
  const places = [...Array(2400).keys()].map(place => place + 1);

  const handleBoardClick = (positionIndex) => {
    if(selectedItem === '') {
      return;
    }
    
    const element = {
      id: positionIndex,
      type: selectedItem === 'ball' ? 'ball' : 'player',
      attribute: {
        team: selectedItem  
      },
      index: positionIndex,
      position: {
        x: Math.floor(positionIndex / 60),
        y: positionIndex % 60
      }
    }
    setOcuppiedPlaces(prevOccupiedPlaces => [...prevOccupiedPlaces, element]);    
  }

  const isItemOnSpace = (positionIndex) => {
    const item = ocuppiedPlaces.find(element => {
      return element.index === positionIndex;
    });
    return !!item;
  }

  const getItemClass = (positionIndex) => {
    const item = ocuppiedPlaces.find(element => {
      return element.index === positionIndex;
    });

    return `${styles.playerOnSpot} ${styles[item.attribute.team]}`;
  }

  return (
    <div className={styles.board}>
      {places.map(key => 
        <button key={key} className={styles.space}
                onClick={() => handleBoardClick(key)}>
                { isItemOnSpace(key) && 
                  <div className={getItemClass(key)}></div>
                }
        </button>
      )}
    </div>
  );
}