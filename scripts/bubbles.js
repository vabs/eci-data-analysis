(function() {
    
    var width=700;
    var height=700;
    
    var tooltip = d3.select("#chart")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "#535233")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white");

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

    var dataHtml = d => (
        "<h3>" + d["name"] + "</h3>" +
        "<table>" + 
        "<th>Cash</th>" + 
        "<th>Liquor Value</th>" +
        "<th>Drugs</th>" +
        "<th>Precious Metals (Gold | Silver)</th>" +
        "<th>Freebies</th>" +
        "<th>Total Value</th>" +
        "<tr>" +
        "<td>" + d["cash"] + "</td>" +
        "<td>" + d["liquor value"] + "</td>" +
        "<td>" + d["drugs value"] + "</td>" +
        "<td>" + d["precious metal value"] + "</td>" +
        "<td>" + d["other items"] + "</td>" +
        "<td><b>" + d["total value"] + "</b></td>" +
        "</tr>" +
        "</table>"
    )
    
    d3.csv('data/data.csv')
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
        
        
        var showTooltip = function(d) {
            tooltip
            .transition()
            .duration(10)
            tooltip
            .style("opacity", 1)
            .html(dataHtml(d))
            .style("left", (d3.mouse(this)[0]+30) + "px")
            .style("top", (d3.mouse(this)[1]+30) + "px")
        }
        var hideTooltip = function(d) {
            tooltip
            .transition()
            .duration(5)
            .style("opacity", 0)
        }
        
        var circles = svg.selectAll("circle")
        .data(datapoints)
        .enter().append("circle")
        .attr("r", function(d) {
            return radiusScale(d["total value"]); 
        })
        .attr("fill", d => accent(d["total value"]))
        .on("mouseover", showTooltip )
        .on("mouseleave", hideTooltip );
        
        var texts = svg.selectAll(null)
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