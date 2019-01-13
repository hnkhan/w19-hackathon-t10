var pieGenerated = false;
console.log("hi");
data = [{"title":"Positive", "value":0.5},
    { "title": "Negative", "value": 0.2},
    { "title": "Neutral", "value": 0.3}];

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

function update() {
    var pie = d3.pie()
        .value(function (d) { return d.value; })(data);
    path = d3.select("#pie").selectAll("path").data(pie); // Compute the new angles
    path.attr("d", arc); // redrawing the path
    d3.selectAll("text").data(pie).attr("transform", function (d) { return "translate(" + labelArc.centroid(d) + ")"; }); // recomputing the centroid and translating the text accordingly.
    populateTextFields();
}

function populateTextFields() {
    for (var i = 0; i < data.length; i++) {
        if (data[i].title === "Positive") {
            d3.select("#pos").text("Positive: " + data[i].value + "%");
        } else if (data[i].title === "Negative") {
            d3.select("#neg").text("Negative: " + data[i].value + "%");
        } else if (data[i].title === "Neutral") {
            d3.select("#neutral").text("Neutral: " + data[i].value + "%");
        }
    }
}

function generatePie() {
    pieGenerated = true;
    g.append("path")
        .attr("d", arc)
        .style("fill", function (d) { return color(d.data.title); });

    g.append("text")
        .attr("transform", function (d) { return "translate(" + labelArc.centroid(d) + ")"; })
        .text(function (d) { return d.data.title; })
        .attr("class", "label");
}

d3.select("#enter")
    .on("click", function () {
        // Make a request for a user with a given ID
        axios.get('http://127.0.0.1:8000/sentimentanalysis/form')
            .then(function (response) {
                // handle success
                console.log('success');
                console.log(response);
            })
        populateTextFields();
        if (pieGenerated) {
            update();
        } else {
            generatePie();
        }
    })