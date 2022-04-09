import React from 'react'; 
import axios from 'axios';
import Chip from '@mui/material/Chip';

class AttributeChip extends React.Component {

	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this)
		this.state = {
			selected: false
		}
	}

	handleClick(event) {
		this.setState({
			selected: !this.state.selected
		}, () => {
			if(this.state.selected == true) {
				this.props.showCollocs(this.props.attributeName, this.props.attributeValue)
			}
		})
	}

	render() {
		return(
				<Chip label={this.props.attributeName} color={this.state.selected ? "primary" : "secondary"} onClick={this.handleClick}/>
			); 
	} 
};

export default AttributeChip;