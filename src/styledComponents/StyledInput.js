import styled from "styled-components";

const StyledInput = styled.textarea`
    display: block;
    background-color: ${props => props.theme.bgPrim};
    color: ${props => props.theme.col};
    caret-color: ${props => props.theme.action};

    &:focus {
        outline: none;
        border-bottom: 1px solid ${props => props.theme.action};
    }

    transition: color 0.25s, background-color 0.25s, border-bottom 0.25s;
`;

export { StyledInput } ;