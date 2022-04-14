import React from 'react'; 
import axios from 'axios';
import TextArea from './TextArea'
import Attribute from './Attribute'

class GenerateArticle extends React.Component {

  constructor(props) {
    super(props);
    this.addAttribute = this.addAttribute.bind(this);
    this.removeSentence = this.removeSentence.bind(this);
  }

  state = {
    sentences: [],
  }
  addAttribute(sentence) {
    let maxi = 0;
    for(let i = 0; i < this.state.sentences.length; i++) {
      maxi = Math.max(maxi, this.state.sentences[i][1]);
    }
    const prevSentences = this.state.sentences;
    prevSentences.push([sentence, maxi + 1]);
    this.setState((prev) => ({
      sentences: prevSentences,
    }), () => {
      console.log(this.state);
    })      
  }
  removeSentence(id) {
    const updatedSentences = this.state.sentences.filter((sentence) => {
      return sentence[1] != id;
    })
    this.setState({
      sentences: updatedSentences,
    })
  }
  render() {
    const attributeComponents = Object.keys(this.props.attributes).map(attributeName => 
      <Attribute 
        attributeName = {attributeName} 
        collocs = {this.props.attributes[attributeName]}
        key = {attributeName}
        addAttribute = {this.addAttribute}
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
            <TextArea 
              sentences = {this.state.sentences}
              removeSentence = {this.removeSentence}
            />
          </div>
          <div style = {{width: '30%', overflow: 'scroll', height: '500px', display: 'flex', flexDirection: 'column', gap: '2%'}}>
              {attributeComponents}
          </div>
        </div>
        }
      </div>
      ); 
  } 
} 
export default GenerateArticle;