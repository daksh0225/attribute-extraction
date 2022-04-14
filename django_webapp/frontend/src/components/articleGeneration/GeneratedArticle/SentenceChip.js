import * as React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

class SentenceChip extends React.Component {
  handleDelete = () => {
      this.props.removeSentence(this.props.id);
  };
  render() {
        return (
            <Stack direction="row">
            <Chip label={this.props.text} onDelete={this.handleDelete} />
            </Stack>
        );
    }
}
export default SentenceChip;