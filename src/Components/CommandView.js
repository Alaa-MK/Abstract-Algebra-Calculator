import React from 'react';
import {
    ListGroup
} from 'react-bootstrap'
import '../styles/CommandView.css';
import {EditableMathField, StaticMathField, addStyles} from 'react-mathquill'
import {parse} from 'mathjs';
import CommandExamples from './CommandExamples'

function ExecutedCommand (props){
    const result = (props.errorOccured ? '' : '= ') + props.result.toString().replace(/,/g, ', ');
    const color = props.errorOccured ? 'red' : 'black';
    return (
        <ListGroup.Item className='listGroupItem'>
            <div className='commandListItem'>
                <StaticMathField className='StaticMathField'>{props.commandLatex}</StaticMathField>
                <div className='StaticMathField' style={{color: color}}>{result}</div>
            </div>
        </ListGroup.Item>
    )
}

export default class CommandView extends React.Component {
    constructor(){
        super();
        addStyles();
        this.state = {
            executedCommands: [],
            currentCommand: '',
            currentLatex: ''
        }
        this._onKeyPress = this._onKeyPress.bind(this);
    }

    _onKeyPress(event){
        if (event.charCode === 13) {
            var result, errorOccured;
            try {
                result = this.props.group.evaluateExpression(this.state.currentCommand);
                errorOccured = false;
            }
            catch (e) {
                result = e;
                errorOccured = true;
            }
            this.setState(prevState => ({executedCommands: [...prevState.executedCommands, {commandLatex: this.state.currentLatex, result: result, errorOccured: errorOccured}]}))
            this.setState({currentCommand: '', currentLatex: ''});
        }
    }

    render() {
        return (
            this.props.group && this.props.group.isValidGroup() &&
            <div id='CommandViewContainer'>
                
                <ListGroup>
                    {this.state.executedCommands.map(command => <ExecutedCommand {...command}/>)}
                </ListGroup>
                <EditableMathField
                    id='CommandField'
                    latex={this.state.currentLatex}                    
                    onChange={field => this.setState({currentCommand: field.text(), currentLatex: field.latex()})}
                    onKeyPress = {this._onKeyPress}
                />
                <CommandExamples 
                    set={this.props.group.set}
                    onClick={expression => this.setState({currentLatex: expression})}
                />
            </div>
        );
    }
}

