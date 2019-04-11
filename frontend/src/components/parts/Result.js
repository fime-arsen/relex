import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import {InteractiveForceGraph, ForceGraphNode, ForceGraphArrowLink} from 'react-vis-force';

var connections = []

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    margin: theme.spacing.unit * 2,
    height: 500,
    overflowX: 'hidden',
    overflowY: 'hidden'
  },
  textArea: {
    overflowY: 'scroll'
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
  state = {
    selNode: null
  }

  hoverOn = (event) => {
    this.deSelectNode(null, this.state.selNode)

    let mouseOn = event.target.textContent
    let graph = this.refs['graph']
    let node = this.refs['node_' + mouseOn]

    graph.setState({'selectedNode': {id: mouseOn}})

    if (typeof node !== 'undefined') this.zoomToNode(node.props)

    connections.forEach(conn => {
      if(mouseOn === conn.source) {
        let element = this.refs[conn.target]
        if (typeof element !== 'undefined') element.classList.add("bindText")
      }
      else if (mouseOn === conn.target) {
        let element = this.refs[conn.source]
        if (typeof element !== 'undefined') element.classList.add("bindText")
      }
    })

  }

  hoverOff = (event) => {
    let mouseOff = event.target.textContent
    let graph = this.refs['graph']

    graph.setState({'selectedNode': null})
    this.resetZoom()

    connections.forEach(conn => {
      if(mouseOff === conn.source) {
        let element = this.refs[conn.target]
        if (typeof element !== 'undefined') element.classList.remove("bindText")
      }
      else if (mouseOff === conn.target) {
        let element = this.refs[conn.source]
        if (typeof element !== 'undefined') element.classList.remove("bindText")
      }
    })
  }


  selectNode = (event, node) => {
   if (!node) return

   this.deSelectNode(null, this.state.selNode)

   this.zoomToNode(event.target)

   connections.forEach(conn => {
      const target = this.refs[conn.target]
      const source = this.refs[conn.source]

      if (node.id === conn.source && node.label === 'source') {
        if (typeof source !== 'undefined') source.classList.add('manualHover')
        if (typeof target !== 'undefined') target.classList.add('bindText')
        source.scrollIntoView()
      }
      else if (node.id === conn.target && node.label === 'target') {
        if (typeof source !== 'undefined') source.classList.add('manualHover')
        if (typeof target !== 'undefined') target.classList.add('bindText')
        target.scrollIntoView()
      }
    })

    this.setState({selNode: node})
  }

  deSelectNode = (event, node) => {
   if (!node) return

   this.resetZoom()

   connections.forEach(conn => {
      const target = this.refs[conn.target]
      const source = this.refs[conn.source]

      if (node.id === conn.source && node.label === 'source') {
        if (typeof source !== 'undefined') source.classList.remove('manualHover')
        if (typeof target !== 'undefined') target.classList.remove('bindText')
      }
      else if (node.id === conn.target && node.label === 'target') {
        if (typeof source !== 'undefined') source.classList.remove('manualHover')
        if (typeof target !== 'undefined') target.classList.remove('bindText')
      }
    })

    this.setState({selNode: null})

  }

  zoomToNode = target => {
    const g = document.getElementsByTagName('g')[1]
    const r = document.getElementsByTagName('rect')[0]
    const t = document.getElementsByTagName('text')

    const x = target.cx.baseVal ? target.cx.baseVal.value : target.cx
    const y = target.cy.baseVal ? target.cy.baseVal.value : target.cy

    const w_w = document.getElementById("graph-container").offsetWidth
    const w_h = document.getElementById("graph-container").offsetHeight

    const set_x = w_w/2 - 2*x
    const set_y = w_h/2 - 2*y
    const m = "matrix(2 0 0 2 " + set_x + " " + set_y + ")"

    g.setAttribute("transform", m)
    r.setAttribute("x", set_x)
    r.setAttribute("y", set_y)
    r.setAttribute("transform", "scale(0.4)")

    for (let i = 0; i < t.length; i++) {
      t[i].setAttribute("font-size", 5)
    }
  }

  resetZoom = () => {
    const g = document.getElementsByTagName('g')[1]
    const r = document.getElementsByTagName('rect')[0]
    const t = document.getElementsByTagName('text')

    const m = "matrix(1 0 0 1 0 0)"

    g.setAttribute("transform", m)
    r.setAttribute("x", 0)
    r.setAttribute("y", 0)
    r.setAttribute("transform", "scale(1)")

    for (let i = 0; i < t.length; i++) {
      t[i].setAttribute("font-size", 10)
    }
  }

  recHighlight = (text, mentions) => {
    if (!mentions.length) return (text)

    let nextMention = mentions[0]

    if (nextMention) {
      mentions.shift()
    }

    return (
      <div key={"sen"+mentions.length} style={{display: 'inline'}}>
        {this.recHighlight(text.substring(0, nextMention[0]), mentions)}
        <span
          className={"markedText"}
          id={text.substring(nextMention[0], nextMention[1]+1)}
          style={{display: 'inline'}}
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

        nodes.push({id: info.participant_a, label: 'source'})
        nodes.push({id: info.participant_b, label: 'target'})
        links.push({source: info.participant_a, target: info.participant_b, value: index_obj})
      })
    })

    uniqueNodes = uniqueArray(nodes)
    uniqueLinks = uniqueArray(links)
    if (uniqueNodes === undefined || uniqueNodes.length === 0) {
      return null
    }
    connections = uniqueLinks

    let forceGraphNodes = []
    for (let i = 0; i<uniqueNodes.length; i++) {
      let color = uniqueNodes[i].label === "source" ? "deepskyblue" : "orangered"
      forceGraphNodes.push(<ForceGraphNode key={"node_"+i} node={uniqueNodes[i]} fill={color} ref={"node_"+uniqueNodes[i].id} />)
    }

    let forceGraphLinks = []
    for (let i = 0; i<uniqueLinks.length; i++) {
      forceGraphLinks.push(<ForceGraphArrowLink key={"link_"+i} link={uniqueLinks[i]} />)
    }

    return  <InteractiveForceGraph
              simulationOptions={{ height: 800, width: 800, strength: {
                  charge: -200
                } }}
              labelAttr="id"
              showLabels
              onSelectNode={(event, node) => this.selectNode(event, node)}
              onDeselectNode={(event, node) => this.deSelectNode(event, node)}
              highlightDependencies
              zoomOptions={{ minScale: 0.1, maxScale: 5 }}
              zoom
              ref='graph'
            >
              {forceGraphNodes}
              {forceGraphLinks}
            </InteractiveForceGraph>
  }

  render() {
    const { classes, json } = this.props

    return (
        <Grid container spacing={24}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" className={classes.title}>
              Highlighted output
            </Typography>
            <Paper className={[classes.paper, classes.textArea]} elevation={1}>
              <Typography variant="body2">
                {this.generateHighlightedText(json)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" className={classes.title}>
              Graph of relations
            </Typography>
            <Paper className={classes.paper} elevation={1} id = "graph-container">
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
