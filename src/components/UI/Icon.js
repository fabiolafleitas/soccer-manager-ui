import React from 'react';
import CircleSVG from './CircleSVG';
import BallSVG from './BallSVG';
import ResetSVG from './ResetSVG';
import SaveSVG from './SaveSVG'
import ListSVG from './ListSVG';
import PlusSVG from './PlusSVG';

export default function Icon({size='32', color='blue', type='circle'}){

  /* Available colors */
  const colors = {
    blue: '#5f9ea0',
    red: '#eb5a5a',
    black: '#2c343a',
    white: '#ffffff'
  };
  let selectedColor = Object.entries(colors).find(([key, value]) => key === color);
  selectedColor = selectedColor ? selectedColor[0] : 'blue';

  const hexColor = colors[selectedColor];

  let icon = <CircleSVG size='32' color={hexColor} />;
  if(type === 'circle'){
    icon = <CircleSVG size={size} color={hexColor} />
  }
  if(type === 'ball'){
    icon = <BallSVG size={size} color={hexColor} />
  }
  if(type === 'reset'){
    icon = <ResetSVG size={size} color={hexColor}/>
  }
  if(type === 'save'){
    icon = <SaveSVG size={size} color={hexColor}/>
  }
  if(type === 'list'){
    icon = <ListSVG size={size} color={hexColor}/>
  }
  if(type === 'plus'){
    icon = <PlusSVG size={size} color={hexColor}/>
  }

  return (
    <>
      {icon}
    </>
  );
}