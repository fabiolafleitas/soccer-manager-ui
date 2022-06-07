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
  console.log({index, x, y});

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