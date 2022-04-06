import React from 'react'; 
import axios from 'axios';
import GenerateArticle from './GenerateArticle';
import SelectDomain from './SelectDomain';
class ArticleGeneration extends React.Component {
    changeDomain(domainName) {
        console.log('set domain to ' + domainName)
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