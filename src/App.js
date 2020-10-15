import React from 'react';
import Group from './Group';
import SideView from './SideView'
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';
import {
  Container,
  Row,
  Col
} from 'react-bootstrap'

class CommandView extends React.Component{
  render(){
    return (
      <div>
        
      </div>
    )
  }
}

export default class App extends React.Component {
  constructor(){
    super();
  }

  onCreateGroup(set, operation){
    const setList = set.split(',');
    console.log(setList)
    let g = new Group(setList, operation);
  }

  render() {
    return (
      <Container fluid>
        <Row>
          <Col className='sideView' sm={4}>
            <SideView onCreateGroup={this.onCreateGroup}/>
          </Col>
          <Col className='commandView' sm={8}>
            <CommandView/>
          </Col>
        </Row>
      </Container>
    );
  }
}

