function getDensityCeiling() { return 3000; }

function initMap() {
	var map = new google.maps.Map(document.getElementById('map_canvas'), {
		center: {lat: 34.064030, lng: -118.358800},
		zoom: 11
	});

	addLegend(map, makeLegend());

	var tracts = getTracts();

	paintTracts(map, tracts);
}

function makeLegend() {
	var legend = document.createElement("div");
	legend.className += " legend";
	legend.innerHTML = '<img src="./images/legend.png">';
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
		// convert from sq m to sq km
		var area = tracts[tract]["area"] / 1000000;
		var dests = tracts[tract]["dests"];
		var destDens = dests / area;
		var origins = tracts[tract]["origs"];
		var origDens = origins / area;
		var paths = tracts[tract]["paths"];
		var color = getColor(origDens, destDens)
		for (var i = 0 ; i < paths.length ; i++) {
			path = paths[i];
			var message = "<table>";
			message += makeTableRow("Tract", tract, true);
			message += makeTableRow("Area", area.toFixed(3) + " sq km");
			if (area > 0) {
				message += makeTableRow("Origins", origins + " (" + origDens.toFixed(1) + " / sq km)");
				message += makeTableRow("Dests", dests + " (" + destDens.toFixed(1) + " / sq km)");
			} else {
				message += makeTableRow("Origins", origins)");
				message += makeTableRow("Dests", dests);
			}

			message += "</table>"
			addPolygon(map, path, color, message);
		}
	}
}

function makeTableRow(label, value, header = false) {
	if (header) {
		var type = "th";
	} else {
		var type = "td"
	}
	var toRet =  '<tr><'+type+' class="rightJust">' + label + ':</'+type+'>';
	toRet += '<'+type+' class="leftJust">' + value + '</'+type+'></tr>';
	return toRet;
}
