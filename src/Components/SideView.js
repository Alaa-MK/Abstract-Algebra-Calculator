import React from 'react';
import GroupInfoView from './GroupInfoView'
import Group from '../Group';
import '../styles/SideView.css';
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
        this._createGroup = this._createGroup.bind(this);
    }

    _setChanged(event){
        this.setState({set: event.target.value})
    }

    _operationChanged(event){
        this.setState({operation: event.target.value})
    }

    _createGroup(){
        var setList = this.state.set.split(',');
        setList.forEach((element, index) => {
            setList[index] = parseInt(element);
        });
        const g = new Group(setList, this.state.operation);
        this.props.onCreateGroup(g);
    }

    render(){
        var info;
        if (this.props.group)
            info = {
                'Closure': this.props.group.isClosed(),
                'Associativity' : this.props.group.isAssociative(),
                'Existence of Identity': this.props.group.identity,
                'Existence of Inverse': this.props.group.inverse(this.props.group.identity)
            }
        return (
            <div id='sideViewContainer'>
                <InputGroupWithTip 
                    text='Set' 
                    onChange={this._setChanged}
                />
                <InputGroupWithTip text='Operation' onChange={this._operationChanged}/>
                <Button 
                    id='sideViewGoButton' 
                    onClick={this._createGroup}
                >
                    GO!
                </Button>
                {info && <GroupInfoView info={info}/>}
            </div>
        )
    }
  }