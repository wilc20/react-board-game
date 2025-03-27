import React from 'react'
import "./Pawn.css";

const Pawn = ({color = "red"}) => {
  return (
    <div className={`${color}`} >pawn</div>
  )
}

export default Pawn;