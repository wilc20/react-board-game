import React from 'react';
import classes from './Item.module.css';

import weaponIcon from '../../assets/items/BOWeaponsExportE.svg';
import explosivesIcon from '../../assets/items/BOExplosivesToken.svg';
import intelIcon from '../../assets/items/BOIntelToken.svg';
import BadgeIcon from '../../assets/items/BOBadgeToken.svg';
import keysIcon from '../../assets/items/BOKeysToken.svg';
import mapIcon from '../../assets/items/BOMapToken.svg';
import poisonIcon from '../../assets/items/BOPoisonToken.svg';
import signatureIcon from '../../assets/items/BOSignatureToken.svg';

const iconTypes = {
    Weapons: weaponIcon,
    Explosives: explosivesIcon,
    Intel: intelIcon,
    Badge: BadgeIcon,
    Keys: keysIcon,
    Map: mapIcon,
    Poison: poisonIcon,
    Signature: signatureIcon
};

const Item = ({itemType = "Weapon"}) => {



  return (
    <div>
        <div className={classes.itemToken}>
            <img src={iconTypes[itemType]} alt="" srcSet="" />
        </div>
    </div>
  )
}

export default Item