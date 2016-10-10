function getDensityCeiling() { return 3000; }
function getTractPath() { return "./testTracts.json"}

function initMap() {
	var tracts = loadTracts();

	var map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 34.064030, lng: -118.358800},
		zoom: 11
	});

	addLegend(map, makeLegend());

	loadTracts(map)
}

function loadTracts(map) {
	$.getJSON(getTractPath(), function(data) {
		paintTracts(data)
	});
}

function makeLegend() {
	var legend = document.createElement("div");
	legend.className += " legend";
	var title = document.createElement("h3")
	title.innerHTML = "Legend";
	legend.appendChild(title);
	var div = document.createElement("div");
	div.innerHTML = 'some html possibly';
	legend.appendChild(div);
	return legend;
}

function getColor(origDensity, destDensity) {
	var densityCeiling = getDensityCeiling();
	var origProp = Math.min(Math.round(origDensity / densityCeiling * 255), 255);
	var destProp = Math.min(Math.round(destDensity / densityCeiling * 255), 255);
	return "rgb(" + destProp + "," + origProp + ", 0)";
}

function paintTracts(map, tracts) {
	for (tract in tracts) {
		var name = tract;
		var area = tracts[tract]["area"];
		var dests = tracts[tract]["destinations"];
		var origins = tracts[tract]["origins"];
		var originDensity = origins / area;
		var paths = tracts[tract]["paths"];
		var color = "#040";
		for (var i = 0 ; i < paths.length ; i++) {
			path = paths[i];
			var message = "<table>";
			message += makeTableRow("Tract", tract, true);
			message += makeTableRow("Area", area);
			message += makeTableRow("Origins", origins);
			message += makeTableRow("Dests", dests);
			message += "</table>"
			addPolygon(map, path, color, message);
			console.log(message);
		}
	}
}

function makeTableRow(label, value, header = false) {
	if (header) {
		return '<tr><th class="right">' + label + ':</th><th class="left">' + value + '</th></tr>';
	} else {
		return '<tr><td class="right">' + label + ':</td><td class="left">' + value + '</td></tr>';
	}
}
