import React from 'react';
import '../../styles/GroupInfoView.css';
import * as Icon from 'react-bootstrap-icons';
import {
    Card,
} from 'react-bootstrap'

function InfoItem(props){
  return (
      <div className='infoItem' style={{color:props.value ? 'green' : 'red'}}>
        {props.value ? 
          <Icon.CheckCircle size={18} color='green' className='icon'/>
          :  
          <Icon.XCircle size={18} color='red' className='icon'/>}
        {props.name}
      </div>
  )
}

export default class GroupInfoView extends React.Component{
    render(){
      return (
        <Card id='groupInfoCard'>
          <div className='infoContaier'>
            {
              Object.keys(this.props.info).map(key => <InfoItem key={key} name={key} value={this.props.info[key]}/>)
            }
          </div>
          <div className='infoContaier'>
            {
              Object.keys(this.props.extraInfo).map(key => <InfoItem key={key} name={key} value={this.props.extraInfo[key]}/>)
            }
          </div>
        </Card>
      )
    }
  }