import React, { useEffect, useMemo, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { boardConfig } from '../config/board';
import { setDimensions, getPostionFromXY, getOccupiedPositions, getSurrondPositionsFromXY } from '../helpers/convert';
import styles from './Board.module.css';

function getStyle(style, snapshot) {
  if (snapshot.isDragging) return style;

  return {
    ...style,
    transform: `none !important`
  };
}


export default function Board(props) {
  const { selectedItem, tacticGroup, tacticSequence } = props;

  /* Fixed board size 60 columns and 40 rows */
  const rows = useMemo(() => setDimensions(boardConfig.ROWS),[]);
  const columns = useMemo(() => setDimensions(boardConfig.COLUMNS),[]);

  const elements = tacticGroup.tactics[tacticSequence].elements; 
  const elementsPosition = getOccupiedPositions(elements);
  console.log(elementsPosition);

  const totalElementsOnBoard = {
      team1: elements.length > 0 ? elements.filter(element => element.attributes.team === 'team1').length : 0,
      team2: elements.length > 0 ? elements.filter(element => element.attributes.team === 'team2').length : 0,
      ball: elements.length > 0 ? elements.filter(element => element.attributes.team === 'ball').length : 0
  };

  const container = useRef();

  useEffect(() => {
    cleanDragStyle();
  }, [tacticGroup]);

  const cleanDragStyle = () => {
    const spots = container.current.querySelectorAll('div.spot');
    spots.forEach(spot => {
      spot.style.removeProperty('transform');
    });
  }

  const handleBoardClick = (row, col) => {
    const positionIndex = getPostionFromXY(col,row)[0]; 

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

    // Check if the selected position is a surrounded position of any element already placed on the board
    if(elementsPosition.includes(positionIndex)){
      return;
    }

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

  const handleElementDrop = (result) => {
    const sourceX = +result.source.index;
    const sourceY = +result.source.droppableId.split('row')[1];
    const sourceIndex = getPostionFromXY(sourceX, sourceY)[0];
    
    const destinationX = +result.destination.index;
    const destinationY = +result.destination.droppableId.split('row')[1];
    const destIndex = getPostionFromXY(destinationX, destinationY)[0];

    // Check if the selected position is a surrounded position of any element already placed on the board
    if(elementsPosition.includes(destIndex) && !getSurrondPositionsFromXY(sourceX, sourceY).includes(destIndex)){
      cleanDragStyle();
      return;
    }

    props.onElementDrop({sourceIndex, destIndex, x:destinationX, y:destinationY});
  }

  const isElementOnSpot = (row, col) => {
    const positionIndex = getPostionFromXY(col,row)[0];
    const elementOnBoard = elements.find(element => {
      return element.index === positionIndex;
    });
    return !!elementOnBoard;
  }

  const getElementClass = (row, col) => {
    const positionIndex = getPostionFromXY(col,row)[0];
    const elementOnBoard = elements.find(element => {
      return element.index === positionIndex;
    });

    return `${styles.player} ${styles[elementOnBoard.attributes.team]}`;
  }

  const getElementNumber = (row, col) => {
    const positionIndex = getPostionFromXY(col,row)[0];
    const elementOnBoard = elements.find(element => {
      return element.index === positionIndex;
    });

    if (elementOnBoard.type === 'ball') {
      return;
    }

    return `${elementOnBoard.attributes.number}`;
  }

  return (
    <DragDropContext onDragEnd={handleElementDrop}>
      <div className={styles.board} ref={container}>
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
                      <div className={`spot ${styles.spot}`}
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
    </DragDropContext>
  );
}
