import styled from "styled-components";

const StyledMsgInput = styled.input`
    background-color: transparent;
    color: ${props => props.theme.col};
    caret-color: ${props => props.theme.action};

    &:focus {
        outline: 2px solid ${props => props.theme.action};
    }
`;

export default StyledMsgInput;