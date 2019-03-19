import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextInputArea from './parts/TextInputArea'
import Result from './parts/Result'
import RelaxStore from '../stores/RelaxStore';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
  },
});

class RelaxHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result_json: RelaxStore.get_result_json(),
      is_loading: RelaxStore.get_loading_status()
    }
  }

  componentWillMount() {
    this._onChange = this._onChange.bind(this);
    RelaxStore.addListener('CHANGE', this._onChange);
  }

  componentWillUnmount() {
    RelaxStore.removeListener("CHANGE", this._onChange);
  }

  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <TextInputArea isLoading={this.state.is_loading}/>
        <Result json={this.state.result_json} />
      </div>
    );
  }

  _onChange() {
      this.setState(
        {
          result_json: RelaxStore.get_result_json(),
          is_loading: RelaxStore.get_loading_status()
        }
      );
  }
}

RelaxHome.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RelaxHome);
