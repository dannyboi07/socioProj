import styled from "styled-components";
import { Link } from "react-router-dom";

const StyledNewChatLink = styled(Link)`
    position: relative;
    color: ${props => props.theme.action};

    transition: color 0.25s;

    &::after {
        position: absolute;
        left: 50%;
        bottom: -1px;
        content: "";
        width: 0;
        height: 1px;
        background-color: ${props => props.theme.action};

        transform: translateX(-50%);

        transition: width 0.25s;
    }

    &:hover {
        cursor: pointer;

        &::after {
            width: 100%;
        }
    }
`;

export default StyledNewChatLink;