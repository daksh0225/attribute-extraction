import React from 'react'; 
import axios from 'axios';
import GenerateArticle from './GenerateArticle';
import SelectDomain from './SelectDomain';
class ArticleGeneration extends React.Component {
    changeDomain(domainName) {
        let data ;
        axios.get('http://localhost:8000/get_collocs/' + domainName)
        .then(res => {
            data = res.data;
            console.log(data);
        })
        .catch(err => {})
    }
    render() {
        return(
            <div>
                <SelectDomain 
                    changeDomain = {this.changeDomain}
                />
                <GenerateArticle />
            </div>
        ); 
    } 
} 
export default ArticleGeneration;