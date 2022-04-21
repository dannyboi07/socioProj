import React from 'react';
import styled from "styled-components";

const StyledLogo = styled.h3`
    color: ${props => props.theme.action};
    transition: color 0.25s;

    @media only screen and (max-width: 768px) {
        font-size: 2.35rem;
    }
`;

function Logo() {
    return (
        <StyledLogo>
            Socio
        </StyledLogo>
    )   
}

export default Logo;