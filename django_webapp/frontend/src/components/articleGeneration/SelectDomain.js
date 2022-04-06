import React from 'react'; 
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Button from '@mui/material/Button';

class SelectDomain extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    state = {
        requestCompleted: false,
        domains: [],
        selectedDomain: "",
    }

    componentDidMount() {
        let data ;

        axios.get('http://localhost:8000/')
        .then(res => {
            data = res.data;
            this.setState({
                requestCompleted: true,
                domains: data,
                selectedDomain: data[0],
            });
        })
        .catch(err => {})
    }

    handleChange(event) {
        console.log(event.target.value);
        this.setState({
            selectedDomain: event.target.value,
        })
    }
    render() {
    return(
        <div>
            {this.state.requestCompleted === true ?
            <div style={{marginTop: '5%', display: 'flex', justifyContent: 'center', gap: '1%'}}>
                <div style={{width: '15%'}}>
                    <Box sx={{ minWidth: 12 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Domain</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={this.state.selectedDomain}
                                label="Domain"
                                onChange={this.handleChange}
                            >
                                {this.state.domains.map((domain) =>  (
                                    <MenuItem value = {domain} key = {domain}>{domain}</MenuItem>
                                    )
                                )}
                            </Select>
                        </FormControl>
                    </Box>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                    <div>
                        <Button 
                            variant="contained"
                            onClick = {() => this.props.changeDomain(this.state.selectedDomain)}
                        >Create Template</Button>
                    </div>
                </div>
            </div>
            :
            <div>
                Loading
            </div>
            }
        </div>
        ); 
    } 
} 
export default SelectDomain;