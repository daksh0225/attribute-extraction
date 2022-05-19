import React from 'react'; 
import axios from 'axios';
import GenerateArticle from './GeneratedArticle/GenerateArticle';
import SelectDomain from './SelectDomain';
import AttributeChip from './AttributeChip';
import CollocChip from './CollocChip';
import Chip from '@mui/material/Chip';

class ArticleGeneration extends React.Component {
    
    constructor(props) {
        super(props);
        this.setDomain = this.setDomain.bind(this);
        this.showCollocs = this.showCollocs.bind(this)
    }

    state = {
        attributes: [],
        selectedDomain: null,
        collocs: [],
    }

    setDomain(domainName) {
        // WHY IS THIS METHOD BEING CALLED ON PAGE RELOAD ???
        let data ;
        axios.get('http://localhost:8000/get_collocs/' + domainName)
        .then(res => {
            data = res.data;
            this.setState({
                selectedDomain: domainName,
                attributes: data
            })
        })
        .catch(err => {})
    }

    showCollocs(attributeName, collocs) {
        let data = this.state.collocs
        data[attributeName] = collocs
        this.setState({
            collocs: data
        });
    }

    render() {
        return(
            <div>
                <SelectDomain 
                    setDomain = {this.setDomain}
                />
                <GenerateArticle 
                    selectedDomain = {this.state.selectedDomain}
                    attributes = {this.state.attributes} 
                />
            </div>
        ); 
    } 
} 
export default ArticleGeneration;