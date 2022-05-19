import React from 'react'; 
import axios from 'axios';
import SentenceChip  from './SentenceChip';

class Attributes extends React.Component {

  render() {
    const sentenceComponents = this.props.sentences.map(sentence => 
      <SentenceChip 
        text = {sentence[0]}
        id = {sentence[1]}
        removeSentence = {this.props.removeSentence}
      />)
    return(
        <div style = {{height: '100%'}}>
          <div style = {{height: '100%', border: '2px solid', margin: '1%', display: 'flex', padding: '1%', flexWrap: 'wrap', alignContent: 'flex-start', gap: '1%', backgroundColor: '#BEFCFF'}}>
            {sentenceComponents}
          </div>
        </div>
      ); 
  } 
} 
export default Attributes;