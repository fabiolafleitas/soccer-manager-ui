const COLUMNS = 60;

export const setDimensions = (dimension) => {
  return [...Array(dimension).keys()].map(index => index + 1);
}

const getXY = (index) => {
  const y = Math.floor(index/COLUMNS)+1;
  const x = index - ((y-1)*COLUMNS);
  return [x,y];
}

export const getPostionFromXY = (x,y) => {
  return x + ((y-1)*COLUMNS);
}

export const getSurrondPositionsFromXY = (index) => {
  const [x, y] = getXY(index);

  return [
    index,
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