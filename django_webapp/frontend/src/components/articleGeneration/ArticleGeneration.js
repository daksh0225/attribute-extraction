import React from 'react'; 
import axios from 'axios';
import GenerateArticle from './GenerateArticle';
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
        let data ;
        axios.get('http://localhost:8000/get_collocs/' + domainName)
        .then(res => {
            data = res.data;
            this.setState({
                selectedDomain: domainName,
                attributes: data
            })
            console.log(this.state.selectedDomain);
            console.log(data);
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
        const allAttributes = Object.keys(this.state.attributes).map(attribute => 
            <AttributeChip attributeName={attribute} attributeValue={this.state.attributes[attribute]} showCollocs={this.showCollocs}/>)
        const allCollocs = Object.keys(this.state.collocs).map(attribute =>
            <CollocChip attributeName={attribute} attributeValue={this.state.collocs[attribute]} />)
        return(
            <div>
                <SelectDomain 
                    setDomain = {this.setDomain}
                />
                <div className="attribute-chips">
                    {allAttributes}
                </div>
                <div className="collocs-chips">
                    {allCollocs}
                </div>
                {/*<GenerateArticle />*/}
            </div>
        ); 
    } 
} 
export default ArticleGeneration;