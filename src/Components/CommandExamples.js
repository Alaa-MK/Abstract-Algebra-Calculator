import React from 'react';
import {
    Button
} from 'react-bootstrap'
import '../styles/CommandExamples.css'
import {StaticMathField} from 'react-mathquill'

function COMMANDS(set) {
    return [
        'e',                                                    //identity
        `|${randomElement(set)}|`,                              //order
        `inv(${randomElement(set)})`,                           //inverse
        `${randomElement(set)}\\cdot${randomElement(set)}`,     //multiplication
        `${randomElement(set)}^2`,                              //power
        `<${randomElement(set)}>`,                              //generatedByEl
        'generators'                                            //generators
    ]
}

function randomElement(items) {
    return items[Math.floor(Math.random() * items.length)];
}
export default class CommandExamples extends React.Component{
    constructor(){
        super();
        this.state={
            examples: []
        }
    }
    componentDidMount(){
        this.setState({examples: COMMANDS(this.props.set)});
    }

    render(){
        return (
            <div id='examplesContainer'>
                {this.state.examples && this.state.examples.map(item => 
                    <Button 
                        className='exampleButton' 
                        variant='light'
                        onClick={()=>this.props.onClick(item)}>
                        <StaticMathField>{item}</StaticMathField>    
                    </Button>    
                )}
            </div>
        )
    }
}

