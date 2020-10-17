import React from 'react';
import GroupInfoView from './GroupInfoView'
import InputGroupWithLabel from './InputGroupWithLabel'
import Group from '../../Group';
import '../../styles/SideView.css';
import {
    Button,
    Table,
    Alert,
    Col,
    Row,
    Card
} from 'react-bootstrap'

export default class SideView extends React.Component{
    constructor(){
        super();
        this.state = {
            set: '1,3,7,9',
            operation: '(a*b)%10',
            info: null,
            extraInfo: null
        }
        this._setChanged = this._setChanged.bind(this);
        this._operationChanged = this._operationChanged.bind(this);
        this._createGroup = this._createGroup.bind(this);
        this.OperationTable = this.OperationTable.bind(this);
        this.QuantitativeInfo = this.QuantitativeInfo.bind(this);
    }

    OperationTable(){
        if (!this.props.group)
            return null;
        return (
            <Table bordered striped>
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

    QuantitativeInfo(){
        if (!this.props.group || !this.props.group.isValidGroup())
            return null;
        return (
            <Card id='quantitativeInfoContainer'>
                {Object.keys(this.state.quantitativeInfo).map(key => <p><b>{key}: </b>{this.state.quantitativeInfo[key]}</p>)}
            </Card>
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
        this.setState({
            info: {
                'Closure': g.isClosed(),
                'Associativity' : g.isAssociative(),
                'Existence of Identity': g.identity !== null,
                'Existence of Inverse': g.inverse(g.identity) !== null
            },
            extraInfo: {
                'Abelian': g.isAbelian()
            },
            quantitativeInfo: {
                'Order': g.groupOrder,
                'Identity': g.identity
            }
        })
    }

    render(){
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
                {this.state.info && <GroupInfoView info={this.state.info} extraInfo={this.state.extraInfo}/>}
                {this.state.info && !this.props.group.isValidGroup() &&
                    <Alert variant='danger'>Not a valid group!</Alert>
                }
                <Row>
                    <Col sm={6} style={{paddingRight: 5}}>
                        <this.QuantitativeInfo/>
                    </Col>
                    <Col sm={6} style={{paddingLeft: 5}}>
                        <this.OperationTable/>
                    </Col>
                </Row>
            </div>
        )
    }
  }