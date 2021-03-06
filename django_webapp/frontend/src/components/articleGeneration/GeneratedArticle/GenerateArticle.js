import React from 'react'; 
import axios from 'axios';
import TextArea from './TextArea';
import Attribute from './Attribute';
import Button from '@mui/material/Button';

import TextField from '@mui/material/TextField';

class GenerateArticle extends React.Component {

  constructor(props) {
    super(props);
    this.addAttribute = this.addAttribute.bind(this);
    this.removeSentence = this.removeSentence.bind(this);
    this.changeArticleName = this.changeArticleName.bind(this);
    this.generateArticle = this.generateArticle.bind(this);
    this.generateArticleText = this.generateArticleText.bind(this);
    this.generateInfobox = this.generateInfobox.bind(this);
    this.generateBody = this.generateBody.bind(this);
  }

  state = {
    sentences: [],
    meta: {},
    articleName: "",
    infobox: [],
  }
  addAttribute(sentence, attribute, value, include) {
    let maxi = 0;
    for(let i = 0; i < this.state.sentences.length; i++) {
      maxi = Math.max(maxi, this.state.sentences[i][1]);
    }
    const prevSentences = this.state.sentences;
    prevSentences.push([sentence, maxi + 1]);
    const meta = this.state.meta;
    meta[attribute] = value;
    const prevInfobox = this.state.infobox;
    if(include) {
      prevInfobox.push([attribute, value])
    }
    this.setState((prev) => ({
      sentences: prevSentences,
      meta: meta,
      infobox: prevInfobox,
    }), () => {
      console.log(this.state);
    })      
  }
  changeArticleName(event) {
    console.log('coming here')
    this.setState({
      articleName: event.target.value,
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
  generateInfobox() {
    let infobox = "{{Infobox\n";
    for(let i = 0; i < this.state.infobox.length; i++) {
      infobox = infobox + "| " + this.state.infobox[i][0] + " = " + this.state.infobox[i][1] + "\n";
    }
    infobox = infobox + "}}";
    return infobox;
  }
  generateBody() {
    let body = "";
    for(let i = 0; i < this.state.sentences.length; i++) {
      body = body + this.state.sentences[i][0] + ". ";
    }
    return body;
  }
  generateArticleText() {
    const infobox = this.generateInfobox()
    const body = this.generateBody();
    return (infobox + "\n" + body);
  }
  generateArticle() {
    if(this.state.articleName === "") {
      alert("Article name is a required field.");
      return;
    }
    const text = this.generateArticleText();
    const element = document.createElement("a");
    const file = new Blob([text], {
      type: "text/plain"
    });
    element.href = URL.createObjectURL(file);
    element.download = "wikiArticle.txt";
    document.body.appendChild(element);
    element.click();
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
            <div style = {{display: 'flex', justifyContent: 'center', marginTop: '2%'}}>
              <TextField
                multiline
                maxRows={1}
                size="small"
                required
                label="Article Name"
                value = {this.state.articleName}
                onChange = {this.changeArticleName}
              />
              <div style={{marginLeft: '1%'}}>
                <Button 
                  variant="contained"
                  color='success'
                  onClick = {this.generateArticle}
                >Generate</Button>
              </div>
            </div>
              {attributeComponents}
          </div>
        </div>
        }
      </div>
      ); 
  } 
} 
export default GenerateArticle;