import { useState } from "react";
/* import fadeMask from "../../css/fademask.module.css"; */
import classes from './List.module.css';

const List = ({ children }) => {
    //const [listStyle, setListStyle] = useState(fadeMask.fademask)

    const handleScroll = (e) => {
        if (e.target.scrollHeight - e.target.scrollTop ===
            e.target.clientHeight) {
           // setListStyle(fadeMask.fademaskInverse)
        } else if (e.target.scrollTop <10){
            //    setListStyle(fadeMask.fademask);
        } else {
           // setListStyle(fadeMask.fademaskBoth);
        }
    };
    //`flex items-center flex-col max-h-[70%] md:max-h-[76%] lg:max-h-[75%] overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] after:bottom-0 ${listStyle}`

    return (
        <ul
            className={classes.list}
            onScroll={handleScroll}
        >
            {children}
        </ul>
    );
};

export default List;
