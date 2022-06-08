import { boardConfig } from '../config/board';

const maxIndex = boardConfig.COLUMNS * boardConfig.ROWS;

export const setDimensions = (dimension) => {
  return [...Array(dimension).keys()].map(index => index + 1);
}

const getXY = (index) => {
  const y = Math.ceil(index / boardConfig.COLUMNS);
  const x = index - ((y - 1) * boardConfig.COLUMNS);
  return [x, y];
}

export const getPostionFromXY = (x,y) => {
  if(x < 1 || x > 60) return [];
  if(y < 1 || y > 40) return [];

  const result = x + ((y - 1) * boardConfig.COLUMNS);
  return result > 0 && result <= maxIndex ? [result] : [];
}

export const getSurrondPositionsFromXY = (index) => {
  const [x, y] = getXY(index);

  let result = [index];
  result = [...result, ...getPostionFromXY(x-1,y-1)] // up left
  result = [...result, ...getPostionFromXY(x,y-1)] // up
  result = [...result, ...getPostionFromXY(x+1,y-1)] // up right
  result = [...result, ...getPostionFromXY(x-1,y)] // left
  result = [...result, ...getPostionFromXY(x+1,y)] // right
  result = [...result, ...getPostionFromXY(x-1,y+1)] //down left
  result = [...result, ...getPostionFromXY(x,y+1)] // down
  result = [...result, ...getPostionFromXY(x+1,y+1)] // down right

  return result;
}

export const getOccupiedPositions = (elements) => {
  let occupiedPositions = [];
  elements.forEach(element => {
    occupiedPositions = [...occupiedPositions, ...getSurrondPositionsFromXY(element.index)];
  });
  
  return  [...new Set(occupiedPositions)];
}

export const buildArrow = (x, y, arrowType) => {
  const result = {
    source : {x: 0, y: 0},
    destination: {x: 0, y: 0}
  }
  let offset = {x: 0, y:0};

  switch (arrowType) {
    case 'topLeft':
      result.source.x = x;
      result.source.y = y;
      result.destination.x = x-20;
      result.destination.y = y-20;
      break;
    case 'top':
      offset.x = 20;
      offset.y = -8;
      result.source.x = x+offset.x;    
      result.source.y = y+offset.y;
      result.destination.x = result.source.x;  
      result.destination.y = result.source.y-30;
      break;
    case 'topRight':
      offset.x = 40;
      result.source.x = x+offset.x;
      result.source.y = y;
      result.destination.x = result.source.x+20;
      result.destination.y = y-20;
      break;
    case 'left':
      offset.x = -8;
      offset.y = 20;
      result.source.x = x+offset.x;
      result.source.y = y+offset.y;
      result.destination.x = result.source.x-30;
      result.destination.y = result.source.y;
      break;
    case 'right':
      offset.x = 40+8;
      offset.y = 20;
      result.source.x = x+offset.x;
      result.source.y = y+offset.y;
      result.destination.x = result.source.x+30;
      result.destination.y = result.source.y;
      break;
    case 'bottomLeft':
      offset.x = 0;
      offset.y = 40;
      result.source.x = x+offset.x;
      result.source.y = y+offset.y;
      result.destination.x = result.source.x-20;
      result.destination.y = result.source.y+20;
      break;
    case 'bottom':
      offset.x = 20;
      offset.y = 40+8;
      result.source.x = x+offset.x;
      result.source.y = y+offset.y;
      result.destination.x = result.source.x;
      result.destination.y = result.source.y+30;
      break;
    case 'bottomRight':
      offset.x = 40;
      offset.y = 40;
      result.source.x = x+offset.x;
      result.source.y = y+offset.y;
      result.destination.x = result.source.x+20;
      result.destination.y = result.source.y+20;
      break;
    default:
      result.source.x = x-10;
      result.source.y = y+20;
      result.destination.x = x-10-40;
      result.destination.y = y+20;
  }

  return result;
}