import React from 'react'
//import PropTypes from 'prop-types'

const shuffle = array => {

    let newArray = array;

    for (let i = newArray.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

  return newArray;
}

export default shuffle