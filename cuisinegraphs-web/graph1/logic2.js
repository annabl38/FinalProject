function buildCharts(sample) {
  var charturl = `/samples/${sample}`
  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data
    function init(){
        d3.json("cuisine_brief_json.json", function(data){
          console.log(data)
          var french= data.french;
          var indian= data.indian;
          var italian=data.italian;
          var chinese= data.chinese;
          var jamacian=data.jamacian;
          var japanese= data.japanese;
          var thai=data.thai;
          var british=data.british;
          var korean= data.korean;
          var filipino=data.filipino;
          var spanish= data.spanish;
          var brazilian=data.brazilian;
          var mexican= data.mexican;
          var greek= data.greek;
          var morrocan=data.morrocan;
          var southern_us=data.southern_us;
          var cajun_creole=data.cajun_creole;
          var vietnamese= data.vietnamese;
          var russian=data.russian;
          var irish=data.irish;
          console.log(indian)
          
    d3.json(charturl).then(function(data){
      var ids = data.otu_ids
      var values = data.sample_values
      var labels = data.otu_labels
      var trace1 = {
        x: ids,
        y: values,
        mode: 'markers',
        text: labels,
        marker: {
          size: values,
          color: ids
        }
      }
      var bubbledata =[trace1]

      Plotly.newPlot('bubble',bubbledata)
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
      var top10values = values.slice(0,10)
      var top10ids = ids.slice(0,10)
      var top10labels=labels.slice(0,10)
      var trace2={
        values: top10values,
        labels: top10ids,
        hovertext: top10labels,
        hoverinfo: "label+text+value+percent",
        type: "pie"
      }
      var piedata=[trace2]

      Plotly.newPlot('pie',piedata)
    })

 

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();l