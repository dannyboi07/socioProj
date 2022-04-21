import styled from "styled-components";

const StyledBtn = styled.button`
    color: ${props => props.theme.actionCol };

    background-color: ${props => props.theme.action};
    transition: background-color 0.25s, color 0.25s;

    &:hover {
        background-color: ${props => props.theme.action}99;
    }
`;

export { StyledBtn as Button };