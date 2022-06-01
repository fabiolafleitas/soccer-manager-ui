import React, { useState, useEffect } from 'react';
import styles from './Board.module.css';

const setBoardDimensions = (rows, columns) => {
  return [...Array(rows*columns).keys()].map(index => index + 1);
}

const getXY = (positionIndex) => {
  const y = Math.floor(positionIndex/60)+1;
  const x = positionIndex - ((y-1)*60);
  return [x,y];
}

const getPostionFromXY = (x,y) => {
  return x + ((y-1)*60);
}

const calculateElementPositions = (positionIndex) => {
  const [x, y] = getXY(positionIndex);
  console.log(x, y);

  return [
    positionIndex,
    getPostionFromXY(x-1,y-1), //up left
    getPostionFromXY(x,y-1), //up
    getPostionFromXY(x+1,y-1), //up right
    getPostionFromXY(x-1,y), //left
    getPostionFromXY(x+1,y), //righ
    getPostionFromXY(x-1,y+1), //down left
    getPostionFromXY(x,y+1), //down
    getPostionFromXY(x+1,y+1)//down right
  ];
}

export default function Board(props) {
  const { selectedItem, isReset, onResetRestart, tacticGroup } = props;

  const [elements, setElements] = useState([]);
  const [elementsPosition, setElementsPosition] = useState([]);
  /* Fixed board size 60 columns and 40 rows */
  const [board] = useState(() => setBoardDimensions(40,60));

  useEffect(() => {
    console.log(tacticGroup);
    setElements(tacticGroup.tactics[0].elements);
  }, [tacticGroup])

  useEffect(() => {
    if(isReset){
      setElements([]);
      onResetRestart();
    }
  }, [isReset, onResetRestart]);  

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

    if(elementsPosition.includes(positionIndex)){
      return;
    }

    const elementSpace = calculateElementPositions(positionIndex);
    setElementsPosition([...elementsPosition, ...elementSpace]);

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
    // setElements(prevOccupiedPlaces => [...prevOccupiedPlaces, element]);
    props.onElementAdd(0, element);
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