function addPath(map, path, color) {
	var thePath = new google.maps.Polyline({
		map: map,
		path: path,
		strokeColor: color,
		strokeOpacity: .5,
		strokeWeight: 2,
	});
}

function addPolygon(map, points, color, message = "") {
	var polygon = new google.maps.Polygon({
		map: map,
		path: path,
		strokeColor: color,
		strokeOpacity: .8,
		strokeWeight: 2,
		fillColor: color,
		fillOpacity: .4
	});

	if (message.length > 0) {
		var caption = new google.maps.InfoWindow({
			content: message
		})

		google.maps.event.addListener(polygon, 'click', function(event) {
			var lat = event.latLng["lat"]();
			var lng = event.latLng["lng"]();
			var position = new google.maps.LatLng({"lat": lat, "lng": lng});
			caption.setPosition(position);
			caption.open(map, polygon);
		});
	}
}

function addMarker(map, location, img) {
	var marker = new google.maps.Marker({
		position: location,
		icon: img,
		map: map
	});
}

function addLegend(map, legend) {
	map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
}
