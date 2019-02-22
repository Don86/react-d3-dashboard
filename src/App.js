import React, { Component } from 'react';
import './App.css';
import * as d3 from "d3";
//import MyChart from "./components/MyChart"
import testTimeData from "./data/testTimeData"

function parseData(myInput) {
  // processes alpha vantage data into a format for viz by chart.js

  // 1. Convert object of objects into array of objects
  // create new key: date (originally a key in the first level of objects)
  let newArray = []
  for (var key in myInput) {
      if (myInput.hasOwnProperty(key)) {
          const newRow = Object.assign({"newDate": new Date(key)}, {"Date": key}, myInput[key])
          newArray.push(newRow)
      }
  }
  //console.log(newArray)
  // 2. Generate plotData for d3js
  let newArray2 = []
  for (var i = 0; i < newArray.length; i++) {
    let newRow = Object.assign({"date": newArray[i]["Date"]}, {"a":parseFloat(newArray[i]["4. close"])})
    newArray2.unshift(newRow)
  }

  return newArray2
}


class App extends Component {
  constructor() {
    super()
    this.state = {
      ticker:"", 
      plotData:[]
    }
    this.drawChart = this.drawChart.bind(this)
  }

  // setState() in componentDidMount()
  componentDidMount() {
    console.log("mount")
    const ticker = "VTSAX"
    const api_key = "EEKL6B77HNZE6EB4"
    fetch("https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol="+ticker+"&apikey="+api_key)
    .then(console.log("fetching..."))
    .then(response => response.json())
    .then(data => parseData(data["Monthly Time Series"]))
    .then(data => console.log(data))
    .then(data =>{this.setState({plotData:data, ticker:ticker})})
    .then(data => this.drawChart())
  }


  drawChart() {
    const stockPlotData = this.state.plotData
    //console.log("stockPlotData.length=", stockPlotData.length)
    var svg = d3.select("body").append("svg")
      .attr("width", 960)
      .attr("height", 300)

    var margin = {left:50, right:30, top:30, bottom: 30}
    var width = svg.attr("width") - margin.left - margin.right;
    var height = svg.attr("height") - margin.bottom - margin.top;

    var x = d3.scaleTime().rangeRound([0, width]);
    //var x_axis = d3.axisBottom(x);
    
    var y = d3.scaleLinear().rangeRound([height, 0]);
    //var y_axis = d3.axisBottom(y);
    var parseTime = d3.timeParse("%Y-%m-%d");
    
    x.domain(d3.extent(stockPlotData, function(d) { return parseTime(d.date); }));
    y.domain([0, 
              d3.max(stockPlotData, function(d) { 
                return d.a;
              })]);
    
    var multiline = function(category) {
      var line = d3.line()
                  .x(function(d) { return x(parseTime(d.date)); })
                  .y(function(d) { return y(d[category]); });
      return line;
    }
    
    var categories = ['a'];
    //var color = d3.scaleOrdinal(d3.schemeCategory10);
    
    var g = svg.append("g")
        .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
    
    for (let i in categories) {
      var lineFunction = multiline(categories[i]);
      g.append("path")
        .datum(stockPlotData) 
        .attr("class", "line")
        .style("stroke", "blue")
        //.style("stroke", color(i))
        .style("fill", "None")
        .attr("d", lineFunction);
    }
  
    // Add the X Axis
    g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m-%d")));
  
    // Add the Y Axis
    g.append("g")
    .call(d3.axisLeft(y));
  }

  render(){
    return (<div>{this.state.ticker}</div>)
  }
}


export default App;