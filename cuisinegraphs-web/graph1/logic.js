// set the dimensions and margins of the graph
var width = 450
    height = 450
    margin = 40

// The radius of the pieplot is half the width or half the height (smallest one). I substract a bit of margin.
var radius = Math.min(width, height) / 2 - margin

// append the svg object to the div called 'my_dataviz'
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    
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

Object.entries(indian).forEach(([key,value])=>{
  console.log(value)
  var v1=value;
  var v2=key;
  var pieData=[
    {
      values: v1,
      labels: v2,
      type: "pie"
    }
  ];
  var pieLayout = {
    height: 400,
    width: 500
  };

  Plotly.newPlot("my_dataviz", pieData, pieLayout);
});
});
}
init();
    // var indian= {"water": 1002, "tomatoes": 738, "tumeric": 630, "garam masala": 534, "curry powder": 510}
    // var italian= {"olive oil": 3480, "water": 1254, "pepper": 1194, "sugar": 1164, "ground black pepper": 1128}
    // var chinese= {"soy sauce": 1944, "sugar": 1182, "water": 864, "eggs": 420, "brown sugar": 354}
    // var jamaican= {"water": 174, "black pepper": 150, "pepper": 138, "sugar": 138, "soy sauce": 126}
    // var japanese = {"soy sauce": 690, "sugar": 582, "water": 426, "sake": 372, "mirin": 246}
    // var thai= {"fish sauce": 936, "soy sauce": 486, "sugar": 480, "water": 306, "lime juice": 252}
    // var british= {"sugar": 294, "eggs": 294, "milk": 234, "pepper": 150, "unsalted butter": 132}
    // var korean= {"soy sauce": 720, "sugar": 390, "water": 222, "sesame seeds": 210, "eggs": 168}
    // var spanish= {"olive oil": 318, "sugar": 240, "water": 180, "kosher salt": 168, "tomatoes": 162}
    // var filipino= {"soy sauce": 384, "water": 348, "sugar": 228, "pepper": 192, "eggs": 174}
    // var french = {"sugar": 972, "unsalted butter": 534, "olive oil": 516, "water": 504, "ground black pepper": 366}
    // var brazilian = {"sugar": 132, "tomatoes": 114, "water": 114, "eggs": 96, "lime": 96}
    // var mexican= {"avocado": 1572, "tomatoes": 1350, "black beans": 1182, "pepper": 1152, "olive oil": 1134}
    // var greek= {"olive oil": 528, "pepper": 306, "tomatoes": 240, "ground black pepper": 234, "feta cheese": 180}
    // var morrocan={"ground cinnamon": 336, "olive oil": 330, "ground ginger": 258, "tumeric": 162, "water": 156}
    // var vietnamese= {"fish sauce": 522, "sugar": 426, "water": 246, "soy sauce": 234, "kosher salt": 114}
    // var southern_us= {"sugar": 1572, "eggs": 972, "pepper": 888, "water": 864, "milk": 828}
    // var cajun_creole= {"green bell pepper": 438, "water": 336, "olive oil": 312, "chicken broth": 264, "dried thyme": 258}
    // var russian= {"sugar": 240, "eggs": 174, "water": 156, "fresh dill": 90, "milk": 72}
    // var irish= {"sugar": 180, "baking soda": 156, "eggs": 138, "water": 132, "potatoes": 126}


    // // set the color scale
    // var color = d3.scaleOrdinal()
    //     .range(d3.schemeDark2);
    
    // // A function that create / update the plot for a given variable:
    // function update(data) {
    
    //   // Compute the position of each group on the pie:
    //   var pie = d3.pie()
    //     .value(function(d) {return d.value; })
    //     .sort(function(a, b) { console.log(a) ; return d3.ascending(a.key, b.key);} ) // This make sure that group order remains the same in the pie chart
    //   var data_ready = pie(d3.entries(data))
    
    //   // map to data
    //   var u = svg.selectAll("path")
    //     .data(data_ready)
    
    //   // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    //   u
    //     .enter()
    //     .append('path')
    //     .merge(u)
    //     .transition()
    //     .duration(1000)
    //     .attr('d', d3.arc()
    //       .innerRadius(0)
    //       .outerRadius(radius)
    //     )
    //     .attr('fill', function(d){ return(color(d.data.key)) })
    //     .attr("stroke", "white")
    //     .style("stroke-width", "2px")
    //     .style("opacity", 1)
    
    //   // remove the group that is not present anymore
    //   u
    //     .exit()
    //     .remove()
    
    // }
    
    // Initialize the plot with the first dataset
    // update(indian)
    
