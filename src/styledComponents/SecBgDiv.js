import styled from "styled-components";

const StyledSecBgDiv = styled.div`
    background-color: ${props => props.theme.bgSec};
    transition: all 0.25s;
`;

export { StyledSecBgDiv as SecBgDiv };