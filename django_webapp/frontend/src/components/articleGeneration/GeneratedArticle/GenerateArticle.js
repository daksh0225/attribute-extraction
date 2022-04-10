import React from 'react'; 
import axios from 'axios';
import TextArea from './TextArea'
import Attribute from './Attribute'

class GenerateArticle extends React.Component {

  render() {
    const attributeComponents = Object.keys(this.props.attributes).map(attributeName => 
      <Attribute 
        attributeName = {attributeName} 
        collocs = {this.props.attributes[attributeName]}
        key = {attributeName}
      />)
    return(
      <div>
        {this.props.selectedDomain === null ?
        <div>
          Select a domain to start writing the article
        </div>
        :
        <div style = {{display: 'flex'}}>
          <div style = {{width: '70%'}}>
            <TextArea />
          </div>
          <div style = {{width: '30%', overflow: 'scroll', height: '500px'}}>
            {attributeComponents}
          </div>
        </div>
        }
      </div>
      ); 
  } 
} 
export default GenerateArticle;