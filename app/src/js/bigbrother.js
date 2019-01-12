var percentPos = 0.5;
var percentNeutral = 0.3;
var percentNeg = 0.2;

percentageData = {"pos": 0.5,
"neg": 0.2,
"neutral": 0.3};

data = [{"title":"positive", "value":0.5},
    { "title": "negative", "value": 0.2},
    { "title": "neutral", "value": 0.3}];

d3.select("#pos").text("Positive: " + percentageData.pos + "%");
d3.select("#neg").text("Negative: " + percentageData.neg + "%");
d3.select("#neutral").text("Neutral: " + percentageData.neutral + "%");

var color = d3.scaleOrdinal()
    .range(["#2C93E8", "#838690", "#F56C4E"]);

var width = 300,
    height = 300,
    radius = Math.min(width, height) / 2;

var pie = d3.pie()
    .value(function (d) { return d.value; })(data);

var arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var labelArc = d3.arc()
    .outerRadius(radius - 60)
    .innerRadius(radius - 70);

var svg = d3.select("#pie")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var g = svg.selectAll("arc")
    .data(pie)
    .enter().append("g")
    .attr("class", "arc");

g.append("path")
    .attr("d", arc)
    .style("fill", function (d) { return color(d.data.title); });

g.append("text")
    .attr("transform", function (d) { return "translate(" + labelArc.centroid(d) + ")"; })
    .text(function (d) { return d.data.title; })
    .attr("class", "label");

function update() {
    var pie = d3.pie()
        .value(function (d) { return d.value; })(data);
    path = d3.select("#pie").selectAll("path").data(pie); // Compute the new angles
    path.attr("d", arc); // redrawing the path
    d3.selectAll("text").data(pie).attr("transform", function (d) { return "translate(" + labelArc.centroid(d) + ")"; }); // recomputing the centroid and translating the text accordingly.
}