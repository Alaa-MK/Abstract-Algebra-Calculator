import React from 'react';
import InputGroupWithLabel from './InputGroupWithLabel'
import '../styles/CommandView.css';
import {
    Card
} from 'react-bootstrap'

function ExecutedCommand (props){
    return (
        <Card className='executedCommand'>
            <Card.Header>{props.command}</Card.Header>
            <Card.Body>
                <Card.Text>{props.result}</Card.Text>
            </Card.Body>
        </Card>
    )
}

export default class CommandView extends React.Component {
    constructor(){
        super();
        this.state = {
            executedCommands: []
        }
        this._onKeyPress = this._onKeyPress.bind(this);
        this._commandChanged = this._commandChanged.bind(this);
    }

    _onKeyPress(event){
        if (event.charCode === 13) {
            const result = this.props.group.evaluateExpression(this.state.currentCommand);
            this.setState(prevState => ({executedCommands: [...prevState.executedCommands, {command: this.state.currentCommand, result: result}]}))
            event.target.value = '';
        }
    }

    _commandChanged(event){
        this.setState({currentCommand: event.target.value})
    }

    render() {
        return (
            <div id='CommandViewContainer'>
                {this.state.executedCommands.map(command => <ExecutedCommand {...command}/>)}
                <InputGroupWithLabel
                    text='>'
                    onKeyPress = {this._onKeyPress}
                    onChange = {this._commandChanged}
                />
            </div>
        );
    }
}

