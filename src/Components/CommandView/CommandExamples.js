import React from 'react';
import {
    Button
} from 'react-bootstrap'
import '../../styles/CommandExamples.css'
import {StaticMathField} from 'react-mathquill'

function COMMANDS(set) {
    return [
        'e',                                                    //identity
        '\\left|G\\right|',                                     //groupOrder
        `\\left|${randomElement(set)}\\right|`,                 //order
        `inv(${randomElement(set)})`,                           //inverse
        `${randomElement(set)}\\cdot${randomElement(set)}`,     //multiplication
        `${randomElement(set)}^2`,                              //power
        `((${randomElement(set)}\\cdot${randomElement(set)})\\cdot${randomElement(set)})^{-1}`,
        `<${randomElement(set)}>`,                              //generatedByEl
        `\\left|<${randomElement(set)}>\\right|`,               //generatedByElOrder
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

