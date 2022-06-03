import React, { useState, useEffect, useMemo } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { setDimensions, getPostionFromXY, getSurrondPositionsFromXY } from '../helpers/convert';
import styles from './Board.module.css';

function getStyle(style, snapshot) {
  if (snapshot.isDragging) return style;

  return {
    ...style,
    transform: `none!important`
  };
}


export default function Board(props) {
  const { selectedItem, tacticGroup, tacticSequence } = props;

  const elements = tacticGroup.tactics[tacticSequence].elements; 
  const [elementsPosition, setElementsPosition] = useState([]);
  /* Fixed board size 60 columns and 40 rows */
  const rows = useMemo(() => setDimensions(40),[]);
  const columns = useMemo(() => setDimensions(60),[]); 

  const totalElementsOnBoard = {
      team1: elements.length > 0 ? elements.filter(element => element.attributes.team === 'team1').length : 0,
      team2: elements.length > 0 ? elements.filter(element => element.attributes.team === 'team2').length : 0,
      ball: elements.length > 0 ? elements.filter(element => element.attributes.team === 'ball').length : 0
  };

  const handleBoardClick = (row, col) => {
    const positionIndex = getPostionFromXY(col,row); 

    // No item selected in toolbar
    if (selectedItem === '') {
       return;
    }

    // Allow max number of players or ball
    if (selectedItem === 'ball'){
      if (totalElementsOnBoard[selectedItem] > 0){
        return;
      }
    } else {
      if (totalElementsOnBoard[selectedItem] === 5){
        return;
      }
    }

    // Check if the selected position is a surrond position of any element already placed on the board
    if(elementsPosition.includes(positionIndex)){
      return;
    }

    const elementSpace = getSurrondPositionsFromXY(positionIndex);
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
        x: row,
        y: col
      }
    }
    props.onElementAdd(tacticSequence, element);
  }

  const isElementOnSpot = (row, col) => {
    const positionIndex = getPostionFromXY(col,row);
    const elementOnBoard = elements.find(element => {
      return element.index === positionIndex;
    });
    return !!elementOnBoard;
  }

  const getElementClass = (row, col) => {
    const positionIndex = getPostionFromXY(col,row);
    const elementOnBoard = elements.find(element => {
      return element.index === positionIndex;
    });

    return `${styles.player} ${styles[elementOnBoard.attributes.team]}`;
  }

  const getElementNumber = (row, col) => {
    const positionIndex = getPostionFromXY(col,row);
    const elementOnBoard = elements.find(element => {
      return element.index === positionIndex;
    });

    if (elementOnBoard.type === 'ball') {
      return;
    }

    return `${elementOnBoard.attributes.number}`;
  }

  return (
    <div className={styles.board}>
      {rows.map(row =>
        <Droppable key={`row${row}`} droppableId={`row${row}`} direction="horizontal" isCombinedEnabled>
          {droppableProvided => (
            <div className={styles.row} 
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
            >
              {columns.map(col => (
                <Draggable key={`col${col}`} draggableId={`row${row}col${col}`} index={col} isDragDisabled={!isElementOnSpot(row,col)}>
                  {(draggableProvided, snapshot) => (
                    <div className={styles.spot}
                      onClick={() => handleBoardClick(row,col)}
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                      style={getStyle(draggableProvided.draggableProps.style, snapshot)}
                    >
                    {isElementOnSpot(row,col) &&
                      <div className={getElementClass(row,col)}>
                        <div className={styles.playerNumber}>
                          {getElementNumber(row,col)}
                        </div>
                      </div>
                    }
                    </div>
                  )}
                </Draggable>
              ))}
              <span style={{visibility: 'hidden'}}>
                {droppableProvided.placeholder}
              </span>
            </div>
          )}
        </Droppable>
      )}
    </div>
  );
}
