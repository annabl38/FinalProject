var restvar = d3.select("#selRestaurant")

var menuvar = d3.select("#selMenu")

var MenuObject = {
    McDonalds: ["French Fries", "Big Mac", "Snack Wraps", "Happy Meal", "Egg McMuffin"],
    Subway: ["Spicy Italian", "Turkey Breast", "Roast Beef", "Subway Club", "Sweet Onion Chicken Teriyaki"],
    Bojangles: ["1-Breast Chicken Dinner With Choice Of 2 Fixin’s", "2-Piece Dinner (Breast & Wing) With Choice Of 2 Fixin’s", "Garden Salad", "Grilled Chicken Salad", "Bo-Tato Rounds"],
    Wendys: ["Crispy Chicken Nuggets", "Spicy Chicken Sandwich", "Frosty", "Fries", "Baconator"],
    PizzaHut:["Mozzarella Stuffed Crust Pizza", "Supreme Pizza", "Bacon Spinach Alfredo Pizza", "Chicken-Bacon Parmesan Supreme Pizza", "Meat Lovers Pizza"],
    TacoBell:["Soft Taco", "Mexican Pizza", "Shredded Chicken Mini Quesadilla", "Nacho Cheese Doritos Locos Taco Supreme", "Cinnamon Twists"],
    ChickfilA:["Waffle fries", "Chicken nuggets", "Chicken sandwich", "Chicken Strips", "Chicken biscuit"],
    BurgerKing:["Whopper", "Chicken Fries", "Hershey's Sundae Pie", "Onion Rings", "French Fries"],
    
  }

restvar.on("change", function(){
    // Clear list
        menuvar.html("")
        // Get Retaurant Selection
    restpic  = restvar.node().value

    // Populate list
        menuvar.selectAll('.option')
        .data(MenuObject[restpic])
        .enter()
        .append("option")
        .html(d=>d) 
    })





// =========================Building the plot==========================


    function buildPlot() {
        /* data route */
      var url = "/api/fastfood";
      d3.json(url).then(function(response) {
    
        count = []
        rest = []
        for (var j = 0; j < response.length; j++) {
            rest.push(response[j][0])
            count.push(response[j][1])
          }

        var trace1 = {
            labels: rest,
            values: count,
            type: 'pie'
          };
          
          var data = [trace1];
          
          var layout = {
            title: "Favorite Restaurants",
          };
        Plotly.newPlot("plot", data, layout);
      });
    }
    buildPlot();



    const width = window.innerWidth,
            height = window.innerHeight,
            maxRadius = (Math.min(width, height) / 2) - 5;

        const formatNumber = d3.format(',d');

        const x = d3.scaleLinear()
            .range([0, 2 * Math.PI])
            .clamp(true);

        const y = d3.scaleSqrt()
            .range([maxRadius*.1, maxRadius]);

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const partition = d3.partition();

        const arc = d3.arc()
            .startAngle(d => x(d.x0))
            .endAngle(d => x(d.x1))
            .innerRadius(d => Math.max(0, y(d.y0)))
            .outerRadius(d => Math.max(0, y(d.y1)));

        const middleArcLine = d => {
            const halfPi = Math.PI/2;
            const angles = [x(d.x0) - halfPi, x(d.x1) - halfPi];
            const r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);

            const middleAngle = (angles[1] + angles[0]) / 2;
            const invertDirection = middleAngle > 0 && middleAngle < Math.PI; // On lower quadrants write text ccw
            if (invertDirection) { angles.reverse(); }

            const path = d3.path();
            path.arc(0, 0, r, angles[0], angles[1], invertDirection);
            return path.toString();
        };

        const textFits = d => {
            const CHAR_SPACE = 6;

            const deltaAngle = x(d.x1) - x(d.x0);
            const r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);
            const perimeter = r * deltaAngle;

            return d.data.name.length * CHAR_SPACE < perimeter;
        };
    // ===================build sunburst========================
    function buildburst() {    
      var url = "/api/sequence";
      //d3.json("https://raw.githubusercontent.com/d3/d3-hierarchy/v1.1.8/test/data/flare.json").then(data=>{
      d3.json(url).then(responses=>{
        
        var layers = {
            name: 'Boot Camp Preferences',
            children: []
        }
        responses.forEach(r=>{
            let restaurants = layers['children']
            let existingRestaurantIndex = restaurants.findIndex(c=>{
                return c['name'] == r['restaurant']
            })
            if(existingRestaurantIndex==-1){
                restaurants.push({
                    name: r['restaurant'],
                    children: [{
                        name: r['menuitem'],
                        children: [
                            {
                                name: r['name'],
                                size: 1
                            }
                        ]
                    }]
                })
            }
            else{
                let menuitems = restaurants[existingRestaurantIndex]['children']
                let existingMenuItemIndex = menuitems.findIndex(c=>{
                    return c['name'] == r['menuitem']
                })
                if(existingMenuItemIndex==-1){
                    menuitems.push({
                        name: r['menuitem'],
                        children: [
                            {
                                name: r['name'],
                                size: 1
                            }
                        ]
                    })
                }
                else{
                    let names = menuitems[existingMenuItemIndex]['children']
                    let existingNamesIndex = names.findIndex(c=>{
                        return c['name'] == r['name']
                    })
                    if(existingNamesIndex==-1){
                        names.push({
                            name: r['name'],
                            size: 1
                        })
                    }
                    // else{
                    //     //This means there's a duplicate.
                    // }
                }
            }
            
        })
        const svg = d3.select('body').append('svg')
            .style('width', '100vw')
            .style('height', '100vh')
            .attr('class','sun')
            .attr('viewBox', `${-width / 2} ${-height / 2} ${width} ${height}`)
            .on('click', () => focusOn()); // Reset zoom on canvas click

        console.log(layers)

        let root = d3.hierarchy(layers);
        root.sum(d => d.size);

        const slice = svg.selectAll('g.slice')
            .data(partition(root).descendants());

        slice.exit().remove();

        const newSlice = slice.enter()
            .append('g').attr('class', 'slice')
            .on('click', d => {
                d3.event.stopPropagation();
                focusOn(d);
            });

        newSlice.append('title')
            .text(d => d.data.name + '\n' + formatNumber(d.size));

        newSlice.append('path')
            .attr('class', 'main-arc')
            .style('fill', d => color((d.children ? d : d.parent).data.name))
            .attr('d', arc);

        newSlice.append('path')
            .attr('class', 'hidden-arc')
            .attr('id', (_, i) => `hiddenArc${i}`)
            .style('fill', 'none')
            // added code for hiding fill
            .attr('d', middleArcLine);

        const text = newSlice.append('text')
            .attr('display', d => textFits(d) ? null : 'none');

        // Add white contour
        text.append('textPath')
            .attr('startOffset','50%')
            .attr('xlink:href', (_, i) => `#hiddenArc${i}` )
            .text(d => d.data.name)
            .style('fill', 'none')
            .style('stroke', '#fff')
            .style('stroke-width', 5)
            .style('stroke-linejoin', 'round');

        text.append('textPath')
            .attr('startOffset','50%')
            .attr('xlink:href', (_, i) => `#hiddenArc${i}` )
            .text(d => d.data.name);
        });

    }
    function focusOn(d = { x0: 0, x1: 1, y0: 0, y1: 1 }) {
      // Reset to top-level if no data point specified

      const transition = d3.select('.sun').transition()
          .duration(750)
          .tween('scale', () => {
              const xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
                  yd = d3.interpolate(y.domain(), [d.y0, 1]);
              return t => { x.domain(xd(t)); y.domain(yd(t)); };
          });

      transition.selectAll('path.main-arc')
          .attrTween('d', d => () => arc(d));

      transition.selectAll('path.hidden-arc')
          .attrTween('d', d => () => middleArcLine(d));

      transition.selectAll('text')
          .attrTween('display', d => () => textFits(d) ? null : 'none');

      moveStackToFront(d);

      //

      function moveStackToFront(elD) {
          d3.select('.sun').selectAll('.slice').filter(d => d === elD)
              .each(function(d) {
                  this.parentNode.appendChild(this);
                  if (d.parent) { moveStackToFront(d.parent); }
              })
      }
  }

    
    
  buildburst();

  
