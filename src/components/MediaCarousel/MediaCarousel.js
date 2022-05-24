import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { SecBgDiv } from "../../styledComponents/SecBgDiv";
import "./mediaCarousel.css";

function MediaCarousel({ postId, postImages, fullscreen = false, className, handleFsClick, inMob = false, inPrev = false }) {

	const theme = useSelector(state => {
		return {
			action: state.theme.action,
			bgPrim: state.theme.bgPrim
		};
	});
	const [imgCtnWidth, setImgCtnWidth] = useState(null);
	const [imgPosInx, setImgPosInx] = useState([]);
	const touchStartX = useRef(0);
	const touchEndX = useRef(0);

	function slideRight(e) {
		if (e) e.stopPropagation();
		if (imgPosInx[0] > -1 * (imgPosInx.length - 1)) {
			setImgPosInx(imgPosInx.map(imgPos => imgPos - 1));
		}
	}

	function slideLeft(e) {
		if (e) e.stopPropagation();
		if (imgPosInx[0] !== 0) {
			setImgPosInx(imgPosInx.map(imgPos => imgPos + 1));
		}
	}

	function handleSwipe() {
		if (((touchStartX.current - touchEndX.current) > 75) && (touchEndX.current < touchStartX.current)) slideRight();
		if (((touchEndX.current - touchStartX.current) > 75) && (touchEndX.current > touchStartX.current)) slideLeft();
	}

	function goLeftRightKey(e) {
		if (e.key === "ArrowRight") {
			slideRight(e);
		} else if (e.key === "ArrowLeft") {
			slideLeft(e);
		}
	}

	useEffect(() => {

		if (postImages) {
			let tempArr = [];
			for (let i = 0; i < postImages.length; i++) {
				tempArr.push(i);
			}
			setImgPosInx([...tempArr]);
		}

		let imgCtn = null;
		imgCtn = fullscreen
			? inMob
				? document.querySelector(".flscrn-post-ctn__left-ctn")
				: document.querySelector(".flscrn-post-ctn__left-ctn")
			: document.querySelector(".post-images-ctn");
		setImgCtnWidth(imgCtn.offsetWidth);

		function windowResizeListen() {
			setImgCtnWidth(imgCtn.offsetWidth);
		}
		if (!inPrev) window.addEventListener("resize", windowResizeListen);

		return () => {
			if (inPrev) window.removeEventListener("resize", windowResizeListen);
		};

	}, []);

	useEffect(() => {

		if (fullscreen) {
			document.addEventListener("keydown", goLeftRightKey);

			return () => document.removeEventListener("keydown", goLeftRightKey);
		}
	}, [imgPosInx]);

	return (
		<SecBgDiv onClick={ handleFsClick }
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
						style={{ left: imgCtnWidth * imgPosInx[i] || 0 }} // I ORed a default of 0 cause on initial render imgCtnW and imgPosInx are not initialized
						className="post-content-img" src={postImage}      // and the css left property gets a value of NaN on first render
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
							style={{  border: `1px solid ${theme.action}`, backgroundColor: imgPosInx[i] === 0 ? theme.action : theme.bgPrim }}
							className={"indicator"}/>
					)
				}
			</div>
		</SecBgDiv>
	);
}

export default MediaCarousel;