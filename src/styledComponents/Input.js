import React from 'react';
import styled from 'styled-components';

const StyledInput = styled.input`
    width: 100%;
    height: 100%;
    padding: 0.75em;
    border-radius: 0.25em;
    border: 1px solid ${props => props.theme.col};

    color: ${props => props.theme.col};
    background-color: ${props => props.theme.bgSec};
    transition: border-color 0.25s;
    caret-color: ${props => props.theme.action};

    &:focus {
      outline: none;
      padding: 0.675em;
      border: 2px solid ${props => props.theme.action};
    };
`

function Input({ type, name, onChange = null, placeholder, onBlur = null, theme }) {
    return (
      <StyledInput 
        type={ type }
        name={ name }
        onChange={ e => onChange(e) }
        placeholder={ placeholder }
        onBlur={ e => onBlur(e) }/>
    );
};

export default Input;