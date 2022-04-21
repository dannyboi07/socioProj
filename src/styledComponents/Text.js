import styled from "styled-components";

const StyledText = styled.p`
    color: ${props => props.theme.col};
    transition: color 0.25s;
`;

export { StyledText as Text };