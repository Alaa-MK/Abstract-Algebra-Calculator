import React from 'react';
import './styles/SideView.css';
import {
    InputGroup,
    FormControl,
    Button,
    Col
} from 'react-bootstrap'

function InputGroupWithTip(props){
    return (
        <InputGroup className='inputGroup'>
            <InputGroup.Prepend>
                <InputGroup.Text>{props.text}</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
                aria-label={props.text}
                onChange={props.onChange}
            />
        </InputGroup>
    )
}

export default class SideView extends React.Component{

    constructor(){
        super();
        this.state = {
            set: '',
            operation: ''
        }
        this._setChanged = this._setChanged.bind(this);
        this._operationChanged = this._operationChanged.bind(this);
    }

    _setChanged(event){
        this.setState({set: event.target.value})
    }

    _operationChanged(event){
        this.setState({operation: event.target.value})
    }

    render(){
      return (
        <div id='sideViewContainer'>
            <InputGroupWithTip 
                text='Set' 
                onChange={this._setChanged}
            />
            <InputGroupWithTip text='Operation' onChange={this._operationChanged}/>
            <Button 
                id='sideViewGoButton' 
                onClick={() => this.props.onCreateGroup(this.state.set, this.state.operation)}
            >
                GO!
            </Button>
        </div>
      )
    }
  }