import React, { useState, useEffect, useRef } from 'react';

import "./mediaCarousel.css";

function MediaCarousel({ postId, postImages, fullscreen = false, className, handleFsClick, inMob = false, inPrev = false }) {

    const [imgCtnWidth, setImgCtnWidth] = useState(null);
    const [imgPosInx, setImgPosInx] = useState([]);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    function slideRight(e) {
        if (e) e.stopPropagation();
        if (imgPosInx[0] > -1 * (imgPosInx.length - 1)) { 
            setImgPosInx(imgPosInx.map(imgPos => imgPos - 1))
        }
    };

    function slideLeft(e) {
        if (e) e.stopPropagation();
        if (imgPosInx[0] !== 0) { 
            setImgPosInx(imgPosInx.map(imgPos => imgPos + 1))
        }
    };

    function handleSwipe() {
        if (((touchStartX.current - touchEndX.current) > 75) && (touchEndX.current < touchStartX.current)) slideRight();
        if (((touchEndX.current - touchStartX.current) > 75) && (touchEndX.current > touchStartX.current)) slideLeft();
    };

    useEffect(() => {

        if (postImages) {
            let tempArr = [];
            for (let i = 0; i < postImages.length; i++) {
                tempArr.push(i);
            };
            setImgPosInx([...tempArr]);
        };
        
        let imgCtn = null;
            imgCtn = fullscreen 
            ? inMob
                ? document.querySelectorAll(".flscrn-post-ctn__left-ctn")[1] 
                : document.querySelector(".flscrn-post-ctn__left-ctn")
            : document.querySelector(".post-images-ctn");
            setImgCtnWidth(imgCtn.offsetWidth);

        function windowResizeListen() {
            setImgCtnWidth(imgCtn.offsetWidth);
        };
        if (!inPrev) window.addEventListener("resize", windowResizeListen);

        return () => {
            if (inPrev) window.removeEventListener("resize", windowResizeListen)
        };
        
    }, []);

    useEffect(() => {

        if (fullscreen) {
            function goLeftRightKey(e) {
                if (e.key === "ArrowRight") {
                    slideRight(e);
                } else if (e.key === "ArrowLeft") {
                    slideLeft(e);
                };
            };
            document.addEventListener("keydown", goLeftRightKey);
    
            return () => document.removeEventListener("keydown", goLeftRightKey);
        }
    }, [imgPosInx]);

    return (
        <div onClick={ handleFsClick } 
        style={{ height: fullscreen || inPrev ? 
                    null 
                    : imgCtnWidth }} 
        className={ fullscreen ? 
                    `post-images-ctn ${className}` 
                    : "post-images-ctn"} 
        onTouchStart={e => touchStartX.current = e.changedTouches[0].screenX}
        onTouchEnd={e => {
            touchEndX.current = e.changedTouches[0].screenX;
            handleSwipe();
        }}>

            <button 
            className="sld-lft-btn" 
            style={{ display: imgPosInx[0] !== 0 
                        && window.screen.width > 768 
                            ? "block" 
                            : "none" }}
            onClick={ slideLeft }>
                <img src="/left-chevron.svg" alt="View left image" />
            </button>

            { 
                postImages.map((postImage, i) => 
                        <img 
                        key={i} 
                        id={`post-img-${postId}-${i}`} 
                        style={{ left: imgCtnWidth * imgPosInx[i] }} 
                        className="post-content-img" src={postImage} 
                        alt={`Post image ${i+1}`}/>) 
            }

            <button 
            className="sld-rgt-btn" 
            style={{ display: imgPosInx[0] > -1 * (imgPosInx.length - 1) 
                    && window.screen.width > 768 
                        ? "block" 
                        : "none" }} 
            onClick={slideRight}>
              <img src="/right-chevron.svg" alt="View right image" />
            </button>

            <div
            style={{ width: 20 * postImages.length + "px" }} // 20, as I want the children to be of width 10px, and space between them of 10, so one instance of that total amt (20px), multiplied by the length of the pictures array
            className="indication-ctn">                  
                {
                    postImages.map((img, i) => 
                        <div 
                        key={i} 
                        className={`indicator ${imgPosInx[i] === 0 ? "indicator--active": "" }`}/>
                    )
                }
            </div>
        </div>
    );
};

export default MediaCarousel;