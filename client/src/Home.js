import React, { Component } from 'react';
import axios from 'axios'
import ResourceList from './ResourceList';
import Legend from './Legend'

import L from 'leaflet'

import {connect} from 'react-redux'
import {setMarkers} from './redux/resources'
import './style.css'

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      resources: [],
      markers: [],
      map: null,
      selectedResource: null
    }
    // this.setMarkers = this.setMarkers.bind(this)
  }
  componentDidMount(){

    //College station 30.6280° N, 96.3344° W
    const position = [30.6280, -96.334]
    const map = L.map('mapid').setView(position, 13)
    //TODO: get this from backend instead
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    setInterval(() => {

      const axiosConfig = {
        method: 'GET',
        // headers: {
        //   'Access-Control-Allow-Origin': '*',
        //   'Content-Type': 'application/json',
        // },
      }
      axios.get('http://127.0.0.1:8000/api/',axiosConfig)
      .then(response =>{
        this.props.setMarkers(response.data, map)
      })
    }, 5000);
  }
  showDetails = (i) => {
    this.setState({selectedResource: this.state.resources[i]})
  }
  hideDetails = () => {
    this.setState({selectedResource: null})
  }
  render() {
    return (
      <div>
        <div style={{display: 'flex', flexDirection: 'row', backgroundColor: '#f1ecec'}}>
          <div id="mapid"></div>
          <div id="resource">
            <div className='card'>
              <ResourceList
                resources={this.props.resources}
                showDetails = {this.showDetails}
              />
            </div>
            <div className='card'>
              <Legend/>
            </div>

          </div>

        </div>
      </div>

    );
  }
}
const mapStateToProps = state => {
  return {
    resources: state.resources.resources,
    markers: state.resources.markers
  }
}
export default connect(mapStateToProps,{setMarkers})(App);
