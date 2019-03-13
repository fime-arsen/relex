import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Graph from 'react-json-graph';
import ReactHtmlParser from 'react-html-parser';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    margin: theme.spacing.unit * 2,
    height: 500,
    overflowY: 'scroll',
    overflowX: 'hidden'
  },
  title: {
    margin: theme.spacing.unit*2
  }
});

function Comparator(a, b) {
   if (a[0] > b[0]) return -1;
   if (a[0] < b[0]) return 1;
   return 0;
 }

class Result extends Component {

  generateHighlightedText = (json) => {
    let text = []

    json.forEach((obj, index) => {
      let mentions = [] //Mentions of each sentence sorted in reverse order
      for (var entKey in obj.unique_entities) {
        if (obj.unique_entities.hasOwnProperty(entKey)) {
          const uniqueEntity = obj.unique_entities[entKey];
          const versions = uniqueEntity.versions

          if (!versions) continue

          for (var verKey in versions) {
            if (versions.hasOwnProperty(verKey)) {
              const version = versions[verKey]

              if (!version.mentions || !version.mentions.length) continue

              for (let i = 0; i < version.mentions.length; i++) {
                mentions.push(version.mentions[i])
              }
            }
          }
        }
      }

      mentions = mentions.sort(Comparator)
      mentions.forEach(mention => {
        obj.text = obj.text.substring(0, mention[0]) + "<mark>" + obj.text.substring(mention[0], mention[1]+1) + "</mark>" +  obj.text.substring(mention[1]+1);
      })
      text.push(ReactHtmlParser(obj.text))
    })

    return text
  }

  generateGraphRelations = (json) => {
    let graphs = []

    json.forEach((obj, index_obj) => {
      obj.extracted_information.forEach((info, index_info) => {
        graphs.push(
          <Graph
            key={"gr_"+index_obj+"_"+index_info}
            height={150}
            json={{
              nodes: [{
                id: '0',
                label: info.participant_a,
                position: {x: 250, y: 25},
              },
              {
                id: '1',
                label: info.participant_b,
                position: {x: 150, y: 90},
              }],
              edges: [{
                source: '0',
                target: '1'
              }],
              isStatic: false, // if true, can't change nodes position by dragging
              isVertical: true, // if true, all edges draw for vertical graph
              isDirected: true, // if false, edges will change connection position depending on source and target nodes position relative to each other

            }}
            onChange={(newGraphJSON) => {}}
            shouldNodeFitContent={true}
          />
        )
      })
    })
    return graphs
  }

  render() {
    const { classes, json } = this.props

    return (
        <Grid container spacing={24}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" className={classes.title}>
              Highlighted output
            </Typography>
            <Paper className={classes.paper} elevation={1}>
              <Typography variant="body2">
                {this.generateHighlightedText(json)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" className={classes.title}>
              Graph of relations
            </Typography>
            <Paper className={classes.paper} elevation={1}>
              {this.generateGraphRelations(json)}
            </Paper>
          </Grid>
        </Grid>
    );
  }
}

Result.propTypes = {
  classes: PropTypes.object.isRequired,
  json: PropTypes.array.isRequired
};

export default withStyles(styles)(Result);
