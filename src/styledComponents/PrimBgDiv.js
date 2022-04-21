import styled from "styled-components";

const StyledNavCtnDiv = styled.div`
    /* position: sticky;
    top: 0;
    width: 100%;
    min-width: 860px;
    height: 75px;

    padding: 0 7em 0 7em;
    
    display: flex;
    align-items: center;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);

    z-index: 10; */

    background-color: ${props => props.theme.bgPrim};
    transition: all 0.25s;
`;

export { StyledNavCtnDiv as PrimBgDiv };