import React from "react";
import styled from "styled-components";
import "./loadingcomp.css";

const StyledLoaderDiv = styled.span`
    &::after {
        border-color: transparent transparent ${props => props.theme.action} ${props => props.theme.action};
    }
`;

function LoadingComp({ mini }) {

	return (
		<div
			className={ `loader-ctn ${mini ? "smaller-ctn" : ""}` }>
			<StyledLoaderDiv className="loader"></StyledLoaderDiv>
		</div>
	);
}

export default LoadingComp;
// <div className={ `loader-ctn ${mini ? "smaller-ctn" : ""}` }>
//     <div className="loader">
//         <span></span>
//         <span></span>
//         <span></span>
//         <span></span>
//     </div>
// </div>