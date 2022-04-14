import * as React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

class SentenceChip extends React.Component {
  handleDelete = () => {
    console.info('You clicked the delete icon.');
  };
  render() {
        return (
            <Stack direction="row">
            <Chip label={this.props.text} onDelete={this.handleDelete} />
            </Stack>
            // <div>
            //     {this.props.text}
            // </div>
        );
    }
}
export default SentenceChip;