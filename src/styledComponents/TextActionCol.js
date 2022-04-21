import styled from "styled-components";

const StyledActionP = styled.p`
    color: ${props => props.theme.action};

    transition: color 0.25s;
`;

export { StyledActionP as TextActionCol };