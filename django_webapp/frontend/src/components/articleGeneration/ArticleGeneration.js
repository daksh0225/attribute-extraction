import React from 'react'; 
import axios from 'axios';
import GenerateArticle from './GenerateArticle';
import SelectDomain from './SelectDomain';
class ArticleGeneration extends React.Component {

  componentDidMount() {

      let data ;

      axios.get('http://localhost:8000/')
      .then(res => {
          // data = res.data;
          // this.setState({
          //     details : data    
          // });
          console.log(res)
      })
      .catch(err => {})
  }

  render() {
    return(
      <div>
          <SelectDomain />
          <GenerateArticle />
      </div>
      ); 
  } 
} 
export default ArticleGeneration;