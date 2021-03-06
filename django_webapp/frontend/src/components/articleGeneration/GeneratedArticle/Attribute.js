import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

class Attribute extends React.Component {
  constructor(props) {
    super(props);
    this.handleExpandClick = this.handleExpandClick.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.changeAttributeValue = this.changeAttributeValue.bind(this);
    this.takeSentenceInput = this.takeSentenceInput.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.changeSentence = this.changeSentence.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.changeInclude = this.changeInclude.bind(this);
  }
  state = {
    expanded: false,
    formValue: 0,
    attributeValue: "",
    showModal: false,
    sentence: "",
    include: false,
  }
  handleExpandClick = () => {
    this.setState((prev) => ({
      expanded: !prev.expanded,
    }));
  };
  handleFormChange(event) {
    this.setState({
      formValue: event.target.value,
    })
  }
  changeAttributeValue(event) {
    this.setState({
      attributeValue: event.target.value,
    })
  }
  takeSentenceInput() {
    if(this.state.attributeValue === "") {
      alert("Atrribute value cannot be empty !")
      return;
    }
    if(this.state.formValue == 0) {
      this.setState({
        showModal: true,
      })
    } else {
      // modify here to account for attribute value and article name.
      this.setState((prevState) => ({
        showModal: true,
        sentence: this.props.collocs[prevState.formValue - 1][0].join(' '),
      }))
    }
  }
  handleClose() {
    this.setState({
      showModal: false,
    })
  }
  handleClose() {
    this.setState({
      showModal: false,
    })
  }
  handleAdd() {
    this.props.addAttribute(this.state.sentence, this.props.attributeName, this.state.attributeValue, this.state.include);
    this.setState({
      showModal: false,
    })
  }
  changeSentence(event) {
    this.setState({
      sentence: event.target.value,
    })
  }
  changeInclude(event) {
    this.setState({
      include: event.target.checked
    })
  }
  render() {
    const individualCollocComponent = this.props.collocs.map((colloc, idx) => {
      const label = colloc[0].join(' ');
      return (
        <FormControlLabel value = {idx + 1} control = {<Radio />} label= {label} />
      )
    })
    return(
      <div style = {{display: 'flex', justifyContent: 'center', border: '2px'}}>
        <Card sx={{ maxWidth: 345 }}>
        <CardHeader
          title = {this.props.attributeName}
          style = {{backgroundColor: '#1976D2', color: 'white'}}
        />  
        <div style = {{display: 'flex', flexDirection: 'column', backgroundColor: '#BEFCFF '}}>
          <div>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
              <Button disabled>Value:</Button> 
              <TextField
                multiline
                maxRows={1}
                size="small"
                value = {this.state.attributeValue}
                onChange = {this.changeAttributeValue}
              />
              </Typography>
            </CardContent>
          </div>
          <div style = {{display: 'flex', justifyContent: 'center'}}>
            <div>
              <FormControlLabel
                label="Include in infobox"
                control={
                  <Checkbox
                    checked={this.state.include}
                    label='Include in infobox'
                    inputProps={{ 'aria-label': 'controlled' }}
                    onChange={this.changeInclude}
                  />
                }
              />
            </div>
          </div>
        </div>
        <div>
          <CardActions disableSpacing>
            <Button
              onClick = {this.takeSentenceInput}
            >
              ADD
            </Button>
            <ExpandMore
              expand={this.state.expanded}
              onClick={this.handleExpandClick}
              aria-expanded={this.state.expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>
        </div>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>
            <FormControl>
              <FormLabel id="demo-controlled-radio-buttons-group">Suggested sentences</FormLabel>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={this.state.formValue}
                onChange={this.handleFormChange}
              >
                {individualCollocComponent}
                <FormControlLabel value= {0} control={<Radio />} label="None" />
              </RadioGroup>
            </FormControl>
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
      <Dialog open={this.state.showModal} onClose={this.handleClose}>
        <DialogTitle>Sentence</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="sentence"
            label="Sentence"
            fullWidth
            variant="standard"
            value={this.state.sentence}
            onChange={this.changeSentence}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose}>Cancel</Button>
          <Button onClick={this.handleAdd}>Add</Button>
        </DialogActions>
      </Dialog>
      </div>
      ); 
  } 
} 
export default Attribute;