import React, {useState} from 'react';

export default function Board(){
  const [ocuppiedPlaces, setOcuppiedPlaces] = useState([]);

  /* Fixed board size 60 columns and 40 rows */
  const places = [...Array(2400).keys()].map(place => place + 1);

  const handleBoardClick = (positionIndex) => {
    setOcuppiedPlaces(prevOccupiedPlaces => [...prevOccupiedPlaces, positionIndex]);    
  }
  return (
    <div className="board">
      {places.map(key => 
        <button key={key} className="space"
                onClick={() => handleBoardClick(key)}>
                {ocuppiedPlaces.includes(key) && 
                  <div className="playerOnSpot"></div>
                }
        </button>
      )}
    </div>
  );
}