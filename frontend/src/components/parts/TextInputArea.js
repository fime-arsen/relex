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
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
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
  input: {
    display: 'none',
  },
  actionArea: {
    flexDirection: 'row',
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
      textBoxCount: 1,
      text: {}
    }
  }

  generateTextbox = () => {
    const { classes } = this.props;
    const { text, textBoxCount } = this.state;

    let textBoxes = []

    for (let id=0; id < textBoxCount; id++) {
      const elId = "input-text-" + id
      textBoxes.push(
        <Paper className={classes.root} elevation={1}>
          <TextField
            id={elId}
            name={elId}
            fullWidth
            multiline
            rows="6"
            value={text[elId]}
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
            id={"upload-text-" + id}
            name={elId}
            type="file"
            onChange={event => this.handleFileChoosen(event.target.files[0], event.target.name)}
          />
          <label htmlFor={"upload-text-" + id}>
            <Button variant="outlined" component="span" className={classes.button} >
               Upload
               <CloudUploadIcon className={classes.rightIcon} />
             </Button>
          </label>
        </Paper>
      )
    }

    return textBoxes
  }

  generateActionButtons = () => {
    const { classes } = this.props;
    const { textBoxCount } = this.state;

    return (
      <div className={classes.actionArea}>
        {textBoxCount >= 1 && textBoxCount < 3 ?
        <Button
          color="primary"
          className={[classes.button, classes.buttonAdd]}
          onClick={() => {this.setState({textBoxCount: textBoxCount+1})}}>
            <AddIcon className={classes.leftIcon} />
            Add more
        </Button> : null }
        {textBoxCount !== 1 ?
          <Button
            color="secondary"
            className={[classes.button, classes.buttonAdd]}
            onClick={() => {
              const elementToDelete = 'input-text-' + (textBoxCount-1)
              delete this.state.text[elementToDelete]
              this.setState({
                ...this.state,
                textBoxCount: textBoxCount-1
              })
            }
            }>
              <DeleteIcon className={classes.leftIcon} />
              Remove
          </Button> : null}
      </div>
    )
  }

  handleTextChange = (event) => {
    const key = event.target.name

    this.setState({
      text: {
        ...this.state.text,
        [key]: event.target.value
      }
    })
  }

  handleFileChoosen = (file, name) => {
    fileReader = new FileReader();
    fileReader.onloadend = event => {
      this.setState({
        text: {
          ...this.state.text,
          [name]: fileReader.result
        }
      })
    }
    fileReader.readAsText(file)
  }

  handleProcess = () => {
    const text = Object.values(this.state.text).join(' ')
    RelexActions.set_result_json(text)
  }


  render() {
    const { classes } = this.props;

    return (
      <div>
        {this.generateTextbox()}
        {this.generateActionButtons()}
        <div style={{textAlign: 'center'}}>
          <div className={classes.fab}>
            <Fade
              in={this.props.isLoading}
              unmountOnExit
            >
              <CircularProgress color="secondary"/>
            </Fade>
          </div>
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
