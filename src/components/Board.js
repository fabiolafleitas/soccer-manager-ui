import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as arrowLine from 'arrow-line';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { boardConfig } from '../config/board';
import { setDimensions, getPostionFromXY, getOccupiedPositions, getSurrondPositionsFromXY, buildArrow} from '../helpers/convert';
import ArrowsMenu from './ArrowsMenu';
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

  const [arrows, setArrows] = useState([]);
  const [elementsMap, setElementsMap] = useState({});
  const container = useRef();

  /* Fixed board size 60 columns and 40 rows */
  const rows = useMemo(() => setDimensions(boardConfig.ROWS),[]);
  const columns = useMemo(() => setDimensions(boardConfig.COLUMNS),[]);

  const elements = tacticGroup.tactics[tacticSequence].elements; 
  const elementsPosition = getOccupiedPositions(elements);

  const totalElementsOnBoard = {
      team1: elements.length > 0 ? elements.filter(element => element.attributes.team === 'team1').length : 0,
      team2: elements.length > 0 ? elements.filter(element => element.attributes.team === 'team2').length : 0,
      ball: elements.length > 0 ? elements.filter(element => element.attributes.team === 'ball').length : 0
  };

  useEffect(() => {
    cleanDragStyle();

    //Add arrows
    const elements = tacticGroup.tactics[tacticSequence].elements;
    const getArrows = (elements) => {
      const result = [];
      elements.forEach(element => {
        let elem = container.current.querySelector(`.spot #row${element.position.y}col${element.position.x}`);
        let rect = elem.getBoundingClientRect();
        if(element.attributes.arrow !== 0){
          const {source, destination} = buildArrow(rect.x, rect.y, element.attributes.arrow);
          const arrow = arrowLine({x:source.x, y:source.y}, {x:destination.x, y:destination.y}, 
            { color: '#d3d3d3', style: 'dash', curvature: 0,
            endpoint: {type: 'arrowHead', fillColor: '#d3d3d3'} });
          result.push(arrow);
        }
      });
      return result;
    }
    const newArrows = getArrows(elements);

    setArrows(newArrows);

    // Clean up arrows
    return function clearArrows(){
      newArrows.forEach(arrow => {
        arrow.remove();
      });
    };
  }, [tacticGroup, tacticSequence]);

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
        number: totalElementsOnBoard[selectedItem] + 1,
        arrow: 0
      },
      index: positionIndex,
      position: {
        x: col,
        y: row
      }
    }
    props.onElementAdd(tacticSequence, element);

    setElementsMap({
      ...elementsMap,
      [positionIndex]: {
        ...elementsMap[positionIndex],
        show: false
      }
    });
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

  const handleElementRemove = (row, col) => {
    const positionIndex = getPostionFromXY(col,row)[0];
    props.onElementRemove(positionIndex);
  }

  const handleElementClick = (row, col) => {
    const positionIndex = getPostionFromXY(col,row)[0];

    const getSubMap = () => {
      let subMap = {};

      for(const key in elementsMap){
        const showValue = elementsMap[key].show;
        subMap = {...subMap, [key]:{show: !showValue && key === positionIndex+'' ? true : false}};
      }

      return subMap;
    }

    setElementsMap(getSubMap());
  }

  const handleArrowClick = (selection, row, col) => {
    const positionIndex = getPostionFromXY(col, row)[0];
    const elementOnBoard = elements.find(element => {
      return element.index === positionIndex;
    });

    setElementsMap({
      ...elementsMap,
      [positionIndex]: {
        ...elementsMap[positionIndex],
        show: false
      }
    });
    if(elementOnBoard.attributes.arrow === selection){
      props.onArrowRemove(positionIndex);
      return;
    }
    props.onArrowAdd(selection, positionIndex);
  }

  const handleDragStart = (event) => {
    const x = event.source.index;
    const y = +event.source.droppableId.split('row')[1];
    const index = getPostionFromXY(x, y)[0];

    const arrowElements = elements.filter(element => {
      return element.attributes.arrow !== 0;
    });

    const arrowIndex = arrowElements.findIndex(arrowElement => {
      return arrowElement.index === index;
    })

    // Hide arrow for the element being dragged
    if(arrowIndex >= 0){
      arrows[arrowIndex].update({ color: 'transparent', endpoint: {fillColor: 'transparent'} });
    }
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

  const getElementShow = (row, col) => {
    const positionIndex = getPostionFromXY(col,row)[0];
    return elementsMap[positionIndex] ? elementsMap[positionIndex].show : false;
  }

  const getElement = (row, col) => {
    return elements.find(element => element.position.x === col && element.position.y === row);
  }

  return (
    <DragDropContext onDragEnd={handleElementDrop} onDragStart={handleDragStart}>
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
                        <div id={`row${row}col${col}`} className={getElementClass(row,col)}
                          onClick={() => {handleElementClick(row,col)}}>
                          <div className={styles.playerNumber}>
                            {getElementNumber(row,col)}
                          </div>
                          <ArrowsMenu show={getElementShow(row,col)}
                            element={getElement(row,col)}
                            onArrowClick={handleArrowClick}
                            onElementRemove={handleElementRemove} />
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