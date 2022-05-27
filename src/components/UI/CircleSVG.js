import React from 'react';

export default function CircleSVG({size='32', color='#5f9ea0'}){
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill={color} className="bi bi-circle-fill" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="8"/>
    </svg>
  );
}
