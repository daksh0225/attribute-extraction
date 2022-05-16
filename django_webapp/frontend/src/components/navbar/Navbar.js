import React from 'react'; 
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import axios from 'axios';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.takeDomainInput = this.takeDomainInput.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.changeDomainName = this.changeDomainName.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
  }
  state = {
    showModal: false,
    domainName: "",
  }
  handleClose() {
    this.setState({
      showModal: false, 
    })
  }
  handleAdd() {
    const domainName = this.state.domainName;
    axios.get('http://localhost:8000/add_domain/' + domainName)
    .then(res => {
      this.setState({
        showModla: false,
      })
    })
    .catch(err => {})
  }
  changeDomainName(event) {
    this.setState({
      domainName: event.target.value,
    })
  }
  takeDomainInput() {
    this.setState({
      showModal: true,
      domainName: "",
    })
  }
  render() {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Wikipedia Article Generation
            </Typography>
            <Button color="inherit" onClick = {this.takeDomainInput}>Add Domain</Button>
          </Toolbar>
        </AppBar>
        <Dialog open={this.state.showModal} onClose={this.handleClose}>
          <DialogTitle>Add New Domain</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="domainName"
              label="Domain Name"
              fullWidth
              variant="standard"
              value={this.state.domainName}
              onChange={this.changeDomainName}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose}>Cancel</Button>
            <Button onClick={this.handleAdd}>Add</Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }
}
export default Navbar;