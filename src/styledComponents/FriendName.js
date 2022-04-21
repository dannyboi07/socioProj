import styled from "styled-components";

const StyledName = styled.h5`
    color: ${props => props.theme.col};

    transition: color 0.25s;
`;

export { StyledName as FriendName };