import React from 'react';
import {
    ListGroup
} from 'react-bootstrap'
import '../styles/CommandView.css';
import {EditableMathField, StaticMathField, addStyles} from 'react-mathquill'
import {parse} from 'mathjs';

function ExecutedCommand (props){
    const latex = '2^3';
    return (
        <ListGroup.Item className='listGroupItem'>
            <div className='commandListItem'>
                <StaticMathField className='StaticMathField'>{props.commandLatex}</StaticMathField>
                <StaticMathField className='StaticMathField'>= {parse(props.result).toTex()}</StaticMathField>
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
            const result = this.props.group.evaluateExpression(this.state.currentCommand);
            this.setState(prevState => ({executedCommands: [...prevState.executedCommands, {commandLatex: this.state.currentLatex, result: result}]}))
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
            </div>
        );
    }
}

