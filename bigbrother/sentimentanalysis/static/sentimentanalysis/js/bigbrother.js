var pieGenerated = false;
console.log("hi");
data = [{"title":"Positive", "value":0.1},
    { "title": "Negative", "value": 0.2},
    { "title": "Neutral", "value": 0.3}];

var posPercent = 0.0;
var negPercent = 0.0;
var neuPercent = 0.0;

var username = '';

function updatePercents() {
    var total = 0;
    for (var i = 0; i < data.length; i++) {
        total += data[i].value;
    }
    console.log("total: " + total);
    for (var i = 0; i < data.length; i++) {
        if (data[i].title === "Positive") {
            console.log("datavalue: " + data[i].value);
            console.log("float total: " + total * 1.0);
            posPercent = data[i].value * 1.0 / total;
        } else if (data[i].title === "Negative") {
            negPercent = data[i].value * 1.0/ total;
        } else if (data[i].title === "Neutral") {
            neuPercent = data[i].value * 1.0/ total;
        }
    }
}

function populateTextFields() {
    d3.select("#pos").text("Positive: " + (posPercent * 100).toFixed(2) + "%");
    d3.select("#neg").text("Negative: " + (negPercent * 100).toFixed(2) + "%");
    d3.select("#neutral").text("Neutral: " + (neuPercent * 100).toFixed(2) + "%");
    d3.select("#name").text("@" + username)
}

/* Pie drawing code taken from Chuck Grimmet
http://www.cagrimmett.com/til/2016/08/19/d3-pie-chart.html
*/
/***************************************************************************/
var color = d3.scaleOrdinal()
    .range(["#2C93E8", "#838690", "#F56C4E"]);

var width = 350,
    height = 350,
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
    // path.attr("d", arc); // redrawing the path
    path.transition().duration(500).attrTween("d", arcTween); // Smooth transition with arcTween
    // d3.selectAll("text").data(pie).attr("transform", function (d) { return "translate(" + labelArc.centroid(d) + ")"; }); // recomputing the centroid and translating the text accordingly.
    d3.selectAll("text").data(pie).transition().duration(500).attrTween("transform", labelarcTween); // Smooth transition with labelarcTween
    populateTextFields();
}

function generatePie() {
    pieGenerated = true;

    g.append("path")
        .attr("d", arc)
        .style("fill", function (d) { return color(d.data.title); })
        .each(function (d) { this._current = d; }); // store the initial angles;

    g.append("text")
        .attr("transform", function (d) { return "translate(" + labelArc.centroid(d) + ")"; })
        .text(function (d) { return d.data.title; })
        .attr("class", "label")
        .each(function (d) { this._current = d; }); // store the initial angles;
}

function arcTween(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function (t) {
        return arc(i(t));
    };
}

function labelarcTween(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function (t) {
        return "translate(" + labelArc.centroid(i(t)) + ")";
    };
}

/***************************************************************************/

d3.select("#enter")
    .on("click", async function () {
        username = document.getElementById('usernameInput').value;
        console.log(username);
        // Make a request for a user with a given ID
        try {
            const response = await axios.get('http://127.0.0.1:8000/sentimentanalysis/form/' + username);
            // handle success
            console.log('success');
            console.log(response);
            console.log(response.data["Positive"]);
            for (var i = 0; i < data.length; i++) {
                if (data[i].title === "Positive") {
                    data[i].value = response.data["Positive"];
                } else if (data[i].title === "Negative") {
                    data[i].value = response.data["Negative"];
                } else if (data[i].title === "Neutral") {
                    data[i].value = response.data["Neutral"];
                }
            }
            updatePercents();
            populateTextFields();
            if (pieGenerated) {
                update();
            } else {
                generatePie();
            }
        } catch (error) {
            // handle error
            console.log(error);
        }
        populateTextFields();
        if (pieGenerated) {
            update();
        } else {
            generatePie();
        }

        document.getElementById("twitterProfile").src="http://avatars.io/twitter/" + username;
        document.getElementById("twitterName").innerHTML = username;

        document.getElementById("twitterProfile").style.visibility = "visible";
        document.getElementById("twitterName").style.visibility = "visible";

    })
