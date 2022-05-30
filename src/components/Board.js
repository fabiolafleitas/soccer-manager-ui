import React, { useState, useEffect } from 'react';
import styles from './Board.module.css';

const setBoardDimensions = (rows, columns) => {
  return [...Array(rows*columns).keys()].map(index => index + 1);
}

export default function Board(props) {
  const { selectedItem, isReset, onResetRestart } = props;

  const [elements, setElements] = useState([]);
  /* Fixed board size 60 columns and 40 rows */
  const [board] = useState(() => setBoardDimensions(40,60));

  useEffect(() => {
    if(isReset){
      setElements([]);
      onResetRestart();
    }
  }, [isReset, onResetRestart]);

  //  const places = [...Array(2400).keys()].map(place => place + 1);
  

  const totalElementsOnBoard = {
      team1: elements.length > 0 ? elements.filter(element => element.attribute.team === 'team1').length : 0,
      team2: elements.length > 0 ? elements.filter(element => element.attribute.team === 'team2').length : 0,
      ball: elements.length > 0 ? elements.filter(element => element.attribute.team === 'ball').length : 0
  };

  const handleBoardClick = (positionIndex) => {
    if (selectedItem === '') {
      return;
    }

    if (selectedItem === 'ball'){
      if (totalElementsOnBoard[selectedItem] > 0){
        return;
      }
    } else {
      if (totalElementsOnBoard[selectedItem] === 5){
        return;
      }
    }

    const element = {
      id: positionIndex,
      type: selectedItem === 'ball' ? 'ball' : 'player',
      attribute: {
        team: selectedItem,
        number: totalElementsOnBoard[selectedItem] + 1
      },
      index: positionIndex,
      position: {
        x: Math.floor(positionIndex / 60),
        y: positionIndex % 60
      }
    }
    setElements(prevOccupiedPlaces => [...prevOccupiedPlaces, element]);
  }

  const isElementOnSpot = (positionIndex) => {
    const elementOnBoard = elements.find(element => {
      return element.index === positionIndex;
    });
    return !!elementOnBoard;
  }

  const getElementClass = (positionIndex) => {
    const elementOnBoard = elements.find(element => {
      return element.index === positionIndex;
    });

    return `${styles.player} ${styles[elementOnBoard.attribute.team]}`;
  }

  const getElementNumber = (positionIndex) => {
    const elementOnBoard = elements.find(element => {
      return element.index === positionIndex;
    });

    if (elementOnBoard.type === 'ball') {
      return;
    }

    return `${elementOnBoard.attribute.number}`;
  }

  return (
    <div className={styles.board}>
      {board.map(key =>
        <button key={key} className={styles.spot}
          onClick={() => handleBoardClick(key)}>
          { isElementOnSpot(key) &&
            <div className={getElementClass(key)}>
              <div className={styles.playerNumber}>
                {getElementNumber(key)}
              </div>
            </div>
          }
        </button>
      )}
    </div>
  );
}