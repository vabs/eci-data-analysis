(function() {
    
    var width=800;
    var height=800;
    
    var svg = d3.select("#chart")
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    .append("g")
    .attr("transform", "translate(0,0)")
    
    function zoomed() {
        svg.attr("transform", d3.event.transform);
      }
      
    var zoom = d3.zoom().on("zoom", zoomed);
    
    svg.call(zoom);

    var radiusScale = d3.scaleSqrt().domain([0, 935]).range([20, 80]);
    
    d3.csv('../data.csv')
    .then(function(data) {
        ready(data);
    })
    .catch(function(error){
        // handle error   
    })
    
    
    function ready(datapoints) {
        
        var accent = d3.scaleOrdinal(d3.schemeDark2);
        
        
        var simulation = d3.forceSimulation()
        .force('charge', d3.forceManyBody().strength(5))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(function(d) {
            return radiusScale(d['total value']) * 1.4;
        }));
        
        var circles = svg.selectAll("circle")
        .data(datapoints)
        .enter().append("circle")
        .attr("r", function(d) {
            return radiusScale(d["total value"]); 
        })
        .attr("fill", d => accent(d["total value"]));
            
            
        let texts = svg.selectAll(null)
        .data(datapoints)
        .enter()
        .append('text')
        .text(d => d.name)
        .attr('text-anchor', 'middle')
        .attr('color', 'black')
        .attr('font-size', 15)
        
        
        
        
        simulation.nodes(datapoints)
        .on('tick', ticked);
        
        function ticked() {
            texts.attr('x', (data) => {
                return data.x
            })
            .attr('y', (data) => {
                return data.y
            });
            
            circles
            .attr('cx', (data) => { return data.x })
            .attr('cy', (data) => { return data.y });
        }    
    }
        
})();