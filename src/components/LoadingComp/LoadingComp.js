import React from 'react';
import "./loadingcomp.css";

function LoadingComp({ mini }) {

    return (
        // <div className={ `loader-ctn ${mini ? "smaller-ctn" : ""}` }>
        //     <div className="loader">
        //         <span></span>
        //         <span></span>
        //         <span></span>
        //         <span></span>
        //     </div>
        // </div>
        <div className={ `loader-ctn ${mini ? "smaller-ctn" : ""}` }>
            <span className="loader"></span>
        </div>
    )
}

export default LoadingComp;