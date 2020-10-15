import React from 'react';
import SideView from './Components/SideView'
import CommandView from './Components/CommandView'
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';
import {
  Container,
  Row,
  Col
} from 'react-bootstrap'

export default class App extends React.Component {
  constructor(){
    super();
    this.state = {
      group: null
    }
    this.onCreateGroup = this.onCreateGroup.bind(this);
  }

  onCreateGroup(group){
    this.setState({group});
    console.log(group);
  }

  render() {
    return (
      <Container fluid>
        <Row>
          <Col className='sideView' sm={4}>
            <SideView group={this.state.group} onCreateGroup={this.onCreateGroup}/>
          </Col>
          <Col className='commandView' sm={8}>
            <CommandView group={this.state.group}/>
          </Col>
        </Row>
      </Container>
    );
  }
}

