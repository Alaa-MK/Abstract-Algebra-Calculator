import React from 'react';
import '../styles/SideView.css';
import {
    InputGroup,
    FormControl
} from 'react-bootstrap'

export default function InputGroupWithLabel(props){
    return (
        <InputGroup className='inputGroup'>
            <InputGroup.Prepend>
                <InputGroup.Text>{props.text}</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
                aria-label={props.text}
                onChange={props.onChange}
                onKeyPress={props.onKeyPress}
                defaultValue={props.defaultValue}
            />
        </InputGroup>
    )
}