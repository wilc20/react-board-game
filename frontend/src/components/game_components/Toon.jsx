import React from 'react';
import "./Pawn.css";


const Toon = ({name = "player1", color = "red"}) => {
  return (
    <div className="pawn">
{/*         <div className='title' >{name}</div> */}
        <div className='head title' style={{backgroundColor: color}}>{name}</div>
        <div className='body' style={{backgroundColor: color}}/>
    </div>
  )
}

export default Toon