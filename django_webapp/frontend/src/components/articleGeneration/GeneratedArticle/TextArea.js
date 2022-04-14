import React from 'react'; 
import axios from 'axios';
import SentenceChip  from './SentenceChip';

class Attributes extends React.Component {

  render() {
    const sentenceComponents = this.props.sentences.map(sentence => 
      <SentenceChip 
        text = {sentence[0]}
      />)
    return(
      <div style = {{border: '2px solid', margin: '1%', height: '100%', display: 'flex', flexWrap: 'wrap', gap: '1%', padding: '1%'}}>
          {sentenceComponents}
      </div>
      ); 
  } 
} 
export default Attributes;