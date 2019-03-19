import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import PlayIcon from '@material-ui/icons/PlayArrow';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import RelexActions from '../../actions/RelaxActions'

var fileReader

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    margin: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textField: {
   marginLeft: theme.spacing.unit,
   marginRight: theme.spacing.unit,
  },
  actionArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    display: 'none',
  },
  button: {
    margin: theme.spacing.unit * 2,
  },
  fab: {
    margin: theme.spacing.unit,
  },
  playIcon: {
    marginRight: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});

class TextInputArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ''
    }
  }

  handleTextChange = (event) => {
    this.setState({text: event.target.value})
  }

  handleFileRead = (event) => {
    const content = fileReader.result;
    this.setState({text: content})
  }

  handleFileChoosen = (file) => {
    fileReader = new FileReader();
    fileReader.onloadend = this.handleFileRead;
    fileReader.readAsText(file)
  }

  handleProcess = () => {
    RelexActions.set_result_json(this.state.text)
  }


  render() {
    const { classes } = this.props;
    const { text } = this.state;

    return (
      <div style={{textAlign: 'center'}}>
        <Paper className={classes.root} elevation={1}>
          <TextField
            id="outlined-multiline-flexible"
            fullWidth
            multiline
            rows="6"
            value={text}
            placeholder="Type text here to process and get binds"
            onChange={this.handleTextChange}
            className={classes.textField}
            margin="normal"
            variant="outlined"
          />
          <Typography variant="body1">
            or
          </Typography>
          <input
            accept="text/plain"
            className={classes.input}
            id="button-file"
            type="file"
            onChange={event => this.handleFileChoosen(event.target.files[0])}
          />
          <label htmlFor="button-file">
            <Button variant="outlined" component="span" className={classes.button}>
               Upload
               <CloudUploadIcon className={classes.rightIcon} />
             </Button>
          </label>
        </Paper>
        <div className={classes.actionArea}>
          <Fade
            in={this.props.isLoading}
            unmountOnExit
          >
            <CircularProgress color="secondary"/>
          </Fade>
          <Fab variant="extended" disabled={(this.props.isLoading || this.state.text==='') ? true : false} color="secondary" aria-label="Run" className={classes.fab} onClick={this.handleProcess}>
            {this.props.isLoading ? null : <PlayIcon className={classes.playIcon} />}
            {this.props.isLoading ? "Processing" : "Run"}
          </Fab>
        </div>
      </div>
    );
  }
}

TextInputArea.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TextInputArea);
