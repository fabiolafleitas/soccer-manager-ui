import React, { useState, useEffect, useMemo } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Droppable } from 'react-beautiful-dnd';
import { DragDropContext } from 'react-beautiful-dnd';
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
  const { selectedItem, isReset, onResetRestart, tacticGroup, tacticSequence } = props;

  const elements = tacticGroup.tactics[tacticSequence].elements; 
  // const [elements, setElements] = useState([]);
  const [elementsPosition, setElementsPosition] = useState([]);
  /* Fixed board size 60 columns and 40 rows */
  const board = useMemo(() => setBoardDimensions(40,60),[]);

  /*
  useEffect(() => {
    setElements(tacticGroup.tactics[tacticSequence].elements);
  }, [tacticGroup,tacticSequence]);
  */

  useEffect(() => {
    if(isReset){
      //setElements([]);
      onResetRestart();
    }
  }, [isReset, onResetRestart]);  

  const totalElementsOnBoard = {
      team1: elements.length > 0 ? elements.filter(element => element.attributes.team === 'team1').length : 0,
      team2: elements.length > 0 ? elements.filter(element => element.attributes.team === 'team2').length : 0,
      ball: elements.length > 0 ? elements.filter(element => element.attributes.team === 'ball').length : 0
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
      attributes: {
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
    props.onElementAdd(tacticSequence, element);
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

    return `${styles.player} ${styles[elementOnBoard.attributes.team]}`;
  }

  const getElementNumber = (positionIndex) => {
    const elementOnBoard = elements.find(element => {
      return element.index === positionIndex;
    });

    if (elementOnBoard.type === 'ball') {
      return;
    }

    return `${elementOnBoard.attributes.number}`;
  }
  
  const handleOnDragEnd = (dragEvent) => {
    console.log(dragEvent);
    props.onElementDrop(+dragEvent.source.droppableId, +dragEvent.destination.droppableId);
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className={styles.board}>
        {board.map(key =>
          <Droppable droppableId={key.toString()} key={key}>
            { (droppableProvided) =>
              <button
              {...droppableProvided.droppableProps}
              ref={droppableProvided.innerRef} 
              key={key} 
              className={styles.spot}
              onClick={() => handleBoardClick(key)}>
              {isElementOnSpot(key) &&
                <Draggable 
                  key={key} 
                  draggableId={key.toString()}
                  index={0}
                  >
                  {(draggableProvided) => 
                    <div
                      key={key}  
                      {...draggableProvided.draggableProps}
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.dragHandleProps}
                      className={getElementClass(key)}>
                      <div className={styles.playerNumber}>
                        {getElementNumber(key)}
                      </div>
                    </div>
                  }
                </Draggable>
              }
              {droppableProvided.placeholder}
              </button>
            }
          </Droppable>
        )}
      </div>
    </DragDropContext>
  );
}