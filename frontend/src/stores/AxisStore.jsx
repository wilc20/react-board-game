import React from 'react';
import { useState } from 'react';

const AxisStore = () => {;

    const [MilitarySupport, setMilitarySupport] = useState(3);
    const [GameStage, setGameStage] = useState(1);
    const [AxisLeaders, setAxisLeaders] = useState({
        'Adolf':'DeutschlandHalle',
        'Goebbels': 'Ministry of Propaganda',
        'Himmler':'Gestapo HQ',
        'Hess':'Hannover',
        'Bormann':'Nuremburg',
        'Göering':'Munich'
    });

   
  return {MilitarySupport, setMilitarySupport, GameStage};
}

export default AxisStore