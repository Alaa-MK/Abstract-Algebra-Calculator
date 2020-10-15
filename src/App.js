import React from 'react';
import Group from './Group';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';
import {
  Container,
  Row,
  Col
} from 'react-bootstrap'

class SideView extends React.Component{
  render(){
    return (
      <div>
        Hello
      </div>
    )
  }
}

class CommandView extends React.Component{
  render(){
    return (
      <div>
        Hello
      </div>
    )
  }
}

export default class App extends React.Component {
  render() {
    let g = new Group([1,3,7,9], '(a*b)%10');
    console.log("RESULT", g.evaluateExpression('3*7'))
    return (
      <Container fluid>
        <Row>
          <Col className='sideView' sm={4}>
            <SideView/>
          </Col>
          <Col className='commandView' sm={8}>
            <CommandView/>
          </Col>
        </Row>
      </Container>
    );
  }
}

