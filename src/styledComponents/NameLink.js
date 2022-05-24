import styled from "styled-components";
import { Link } from "react-router-dom";

const StyledNameLink = styled(Link)`
    position: relative;
    color: gray;

    transition: color 0.25s;

    &::after {
        position: absolute;
        left: 50%;
        bottom: -2px;
        width: 0;
        height: 1px;
        
        content: "";
        background-color: ${props => props.theme.action};

        transform: translateX(-50%);

        transition: width 0.25s;
    }

    &:hover {
        color: ${props => props.theme.action};

        &::after {
            width: 100%;
        }
    }
    transition: color 0.25s;
`;

function NameLink({ to, children }) {
	return (
		<StyledNameLink to={ to }>
			{
				children
			}
		</StyledNameLink>
	);
}

export default NameLink;
