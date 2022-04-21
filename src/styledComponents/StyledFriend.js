import styled from "styled-components";

const StyledFriend = styled.div`
    background-color: ${props => props.theme.bgSec};
    border-bottom: 1px solid ${props => props.theme.col}50;

    transition: background-color 0.25s, border-bottom 0.25s;

    &.frnd-ctn--active {
        background-color: ${props => props.theme.bgPrim};
    }

    // The classname here comes from Friend.js, the classname is appended to the name of the friend present in the active chat
    &:not(.frnd-ctn--active):hover {
        cursor: pointer;
        background-color: ${props => props.theme.bgSec}90;
    }
`;

export default StyledFriend;