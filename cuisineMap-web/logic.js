// Create a map object
var myMap = L.map("map", {
  center: [15.5994, -28.6731],
  zoom: 3
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-basic",
  accessToken: API_KEY
}).addTo(myMap);

// Country data
var countries = [
  {
    name: "Brazilian",
    location: [-14.2350, -51.9253],
    points: 467
  },
  {
    name: "British",
    location: [55.3781, -3.4360],
    points: 804
  },
  {
    name: "Filipino",
    location: [14.6760, 121.0437],
    points: 755
  },
  {
    name: "Spanish",
    location: [40.4637, -3.7492],
    points: 989
  },
  {
    name: "Jamacian",
    location: [18.1096, -77.2975],
    points: 526
  },
  {
    name: "Thai",
    location: [15.8700, 100.9925],
    points: 1539
  },
  {
    name: "French",
    location: [46.2276, 2.2137],
    points: 2646
  },
  {
    name: "Chinese",
    location: [35.8617, 104.1954],
    points: 2673
  },
  {
    name: "Mexican",
    location: [23.6345, -102.5528],
    points: 6438
  },
  {
    name: "Korean",
    location: [35.9078, 127.7669],
    points: 830
  },
  {
    name: "Japanese",
    location: [36.2048, 138.2529],
    points: 1423
  },
  {
    name: "Indian",
    location: [20.5937, 78.9629],
    points: 3003
  },
  {
    name: "Irish",
    location: [53.1424, -7.6921],
    points: 667
  },
  {
    name: "Russian",
    location: [61.5240, 105.3188],
    points: 489
  },
  {
    name: "Vietnamese",
    location: [14.0583, 108.2772],
    points: 825
  },
  {
    name: "Moroccan",
    location: [31.7917, -7.0926],
    points: 821
  },
  {
    name: "Cajun-Creole",
    location: [29.9511, -90.0715],
    points: 1546
  },
  {
    name: "Southern US",
    location: [32.0809, -81.0912],
    points: 4320
  },
  {
    name: "Greek",
    location: [39.0742, 21.8243],
    points: 1175
  },
  {
    name: "Italian",
    location: [41.8719, 12.5674],
    points: 7838
  }
];


// Loop through the cities array and create one marker for each city object
for (var i = 0; i < countries.length; i++) {

  // Conditionals for countries points
  var color = "";
  if (countries[i].points > 2000) {
    color = "green";
  }
  else if (countries[i].points > 1500) {
    color = "blue";
  }
  else if (countries[i].points > 1000) {
    color = "orange";
  }
  else if (countries[i].points > 500) {
    color = "gold";
  }
  else {
    color = "yellow";
  }

  // Add circles to map
  L.circle(countries[i].location, {
    fillOpacity: 0.75,
    color: "white",
    fillColor: color,
    // Adjust radius
    radius: countries[i].points * 150
  }).bindPopup("<h1>" + countries[i].name + "</h1> <hr> <h3>Count: " + countries[i].points + "</h3>").addTo(myMap);
}
