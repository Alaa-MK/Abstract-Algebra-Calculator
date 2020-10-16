import React from 'react';
import GroupInfoView from './GroupInfoView'
import InputGroupWithLabel from './InputGroupWithLabel'
import Group from '../Group';
import '../styles/SideView.css';
import {
    Button,
    Table,
    Alert
} from 'react-bootstrap'

export default class SideView extends React.Component{

    constructor(){
        super();
        this.state = {
            set: '1,3,7,9',
            operation: '(a*b)%10'
        }
        this._setChanged = this._setChanged.bind(this);
        this._operationChanged = this._operationChanged.bind(this);
        this._createGroup = this._createGroup.bind(this);
        this._getTable = this._getTable.bind(this);
    }


    _getTable(){
        if (!this.props.group)
            return null;
        return (
            <Table bordered>
                <thead>
                    <tr className='label'>
                        <th/>
                        {this.props.group.set.map(element => <th>{element}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {this.props.group.operationTable().map((row, index) =>
                        <tr> 
                            <td className='label'>{this.props.group.set[index]}</td>
                            {row.map(element => <td>{element}</td>)}
                        </tr>
                    )}
                </tbody>
            </Table>
        )
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
        var info, extraInfo;
        if (this.props.group){
            info = {
                'Closure': this.props.group.isClosed(),
                'Associativity' : this.props.group.isAssociative(),
                'Existence of Identity': this.props.group.identity !== null,
                'Existence of Inverse': this.props.group.inverse(this.props.group.identity) !== null
            }
            extraInfo = {
                'Abelian': this.props.group.isAbelian()
            }
        }
        return (
            <div id='sideViewContainer'>
                <InputGroupWithLabel 
                    text='Set' 
                    onChange={this._setChanged}
                    defaultValue={this.state.set}
                />
                <InputGroupWithLabel 
                    text='Operation' 
                    onChange={this._operationChanged}
                    defaultValue={this.state.operation}
                />
                <Button 
                    id='sideViewGoButton' 
                    onClick={this._createGroup}
                >
                    GO!
                </Button>
                {info && <GroupInfoView info={info} extraInfo={extraInfo}/>}
                {info && !this.props.group.isValidGroup() &&
                    <Alert variant='danger'>Not a valid group!</Alert>
                }
                {this._getTable()}
            </div>
        )
    }
  }