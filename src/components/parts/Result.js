import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Graph } from 'react-d3-graph';

var connections = []

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

const graphConfig = {
    width: 600,
    nodeHighlightBehavior: true,
    directed: true,
    d3: {
       alphaTarget: 0.5,
       gravity: -200,
   },

    node: {
        color: 'lightblue',
        size: 500,
        highlightStrokeColor: 'blue',
        fontSize: 14,
    },
    link: {
        color: 'lightgray',
        strokeWidth: 3,
        // type: "CURVE_SMOOTH"
    }
};

function Comparator(a, b) {
   if (a[0] > b[0]) return -1;
   if (a[0] < b[0]) return 1;
   return 0;
 }

class Result extends Component {
  state = {
    selNode: null
  }

  hoverOn = (event) => {
    let mouseOn = event.target.textContent

    this.refs['graph'].onMouseOverNode(mouseOn)
    // this.refs['graph'].onChange()

    this.setState({selNode: mouseOn})

    connections.forEach(conn => {
      if(mouseOn === conn.source) {
        let element = this.refs[conn.target]
        element.classList.add("bindText")
      }
      else if (mouseOn === conn.target) {
        let element = this.refs[conn.source]
        element.classList.add("bindText")
      }
    })
  }

  hoverOff = (event) => {
    let mouseOff = event.target.textContent

    connections.forEach(conn => {
      if(mouseOff === conn.source) {
        let element = this.refs[conn.target]
        element.classList.remove("bindText")
      }
      else if (mouseOff === conn.target) {
        let element = this.refs[conn.source]
        element.classList.remove("bindText")
      }
    })
  }

  recHighlight = (text, mentions) => {
    if (!mentions.length) return (text)

    let nextMention = mentions[0]

    if (nextMention) {
      mentions.shift()
    }

    return (
      <div key={"sen"+mentions.length}>
        {this.recHighlight(text.substring(0, nextMention[0]), mentions)}
        <span
          className={"markedText"}
          onMouseEnter={this.hoverOn}
          onMouseLeave={this.hoverOff}
          ref={text.substring(nextMention[0], nextMention[1]+1)}
        >
          {text.substring(nextMention[0], nextMention[1]+1)}
        </span>
        {text.substring(nextMention[1]+1)}
      </div>
    )
  }

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
      text.push(this.recHighlight(obj.text, mentions))
    })

    return text
  }

  generateGraphRelations = (json) => {
    var nodes = []
    var links = []
    var uniqueLinks = []
    var uniqueNodes = []
    const uniqueArray = a => [...new Set(a.map(o => JSON.stringify(o)))].map(s => JSON.parse(s));


    json.forEach((obj, index_obj) => {
      obj.extracted_information.forEach((info, index_info) => {

        nodes.push({id: info.participant_a})
        nodes.push({id: info.participant_b})
        links.push({source: info.participant_a, target: info.participant_b})
      })
    })

    uniqueNodes = uniqueArray(nodes)
    uniqueLinks = uniqueArray(links)
    if (uniqueNodes === undefined || uniqueNodes.length === 0) {
      return <Grid/>
    }
    connections = uniqueLinks

    return <Graph
                id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
                config={graphConfig}
                key="graph-id"
                ref="graph"
                data={{
                  nodes: uniqueNodes,
                  links: uniqueLinks
                }}
                // onChange={(newGraphJSON) => {console.log("ASDSADA", newGraphJSON)}}
                onMouseOverNode={(node) => console.log("MouseOverNode", node)}
                shouldNodeFitContent={true}
              />
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
