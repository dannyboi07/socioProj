import styled from "styled-components";

const StyledCommInput = styled.textarea`
    display: block;
    background-color: ${props => props.theme.bgPrim};
    color: ${props => props.theme.col};
    caret-color: ${props => props.theme.action};
    transition: border-color 0.25s, color 0.25s;

    &:focus {
        outline: none;
        border-bottom: 2px solid ${props => props.theme.action};
    }
`;

export { StyledCommInput as TextArea };