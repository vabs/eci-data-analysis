(function() {
    const margin = 80;
    var width=700;
    var height=700;
    // var color = d3.scaleOrdinal(d3.schemeCategory20);
    
    var svg = d3.select("#bar-chart")
    .append("svg")
    .attr("height", height+margin)
    .attr("width", width + margin)
    .append("g")
    .attr("transform", `translate(${margin}, ${margin})`);
    
    d3.csv('data/bar.csv')
    .then(function(data) {
        plot(data);
    })
    .catch(function(error){
        // handle error   
    });
    
    function plot(data) {
        
        yValues = data.map(d => d["value"]);
        ymax = d3.max(yValues);
        
        const yScale = d3.scaleLinear()
        .range([height-margin, 0])
        .domain([0, ymax]);
        
        const xScale = d3.scaleBand()
        .range([0, width-margin])
        .domain(data.map((s) => s.name))
        .padding(0.2);
        
        const makeYLines = () => d3.axisLeft()
        .scale(yScale)
        
        svg.append('g')
        .attr('transform', `translate(0, ${height-margin})`)
        .attr('style', 'font-size:13px;')
        .call(d3.axisBottom(xScale));
        
        svg.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0, 0)`)
        .call(d3.axisLeft(yScale));
        
        svg.append('g')
        .attr('class', 'grid')
        .call(makeYLines()
        .tickSize(-width, 0, 0)
        .tickFormat('')
        )
        
        svg.append('text')
        .attr('x', -(height / 2) + margin)
        .attr('y', -50)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text('Amount (in Cr.)')
        
        svg.append('text')
        .attr('x', width / 2 + margin)
        .attr('y', -60)
        .attr('text-anchor', 'middle')
        .text('Seizure VS Government Schemes')
        
        svg.append('text')
        .attr('class', 'label')
        .attr('x', width / 2 + margin)
        .attr('y', height - margin * 0.4)
        .attr('text-anchor', 'middle')
        .text('Government Schemes')
        
        const barGroups = svg.selectAll()
        .data(data)
        .enter()
        .append('g')
        
        barGroups.append('rect')
        .attr('x', (s) => xScale(s.name))
        .attr('y', (s) => yScale(s.value) + margin)
        .attr('transform', `translate(0, ${-margin})`)
        .attr('height', (s) => height - yScale(s.value) - margin)
        .attr('width', xScale.bandwidth())
        .attr('fill', (s) => { 
            return s.name.indexOf(2019) > -1 ? '#e3191c' : 
            s.name.indexOf(2014) > -1 ? '#e6ab03' : '#ff7f00'})
        
        barGroups.append('text')
        .attr('class', 'value')
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .attr('x', (s) => xScale(s.name) + margin * 0.8)
        .attr('y', (s) => yScale(s.value) + margin * 0.4)
        .text((s) => s.value)
    }
    
    
    
})();