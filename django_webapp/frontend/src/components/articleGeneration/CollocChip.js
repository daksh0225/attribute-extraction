import React from 'react'; 
import axios from 'axios';
import Chip from '@mui/material/Chip';

class CollocChip extends React.Component {

	constructor(props) {
		super(props);
		// this.handleClick = this.handleClick.bind(this);
		// this.handleDelete = this.handleDelete.bind(this);
		this.state = {
			selected: false
		};
	}

	handleClick(event) {
		console.log("you clicked this colloc");
	}

	handlDelete(event) {
		console.log("you deleted this colloc");
	}

	render() {
		const collocsChips = this.props.attributeValue.map(value =>
			<Chip label={value[0].join(" ")}/>)
		return(
			<div>
				<div> {this.props.attributeName} </div>
				<div> {collocsChips} </div>
			</div>
		); 
	} 
};

export default CollocChip;