function modifyValues(orig, eff) {
	for (var key in eff) {
		var newValue = eff[key] + orig[key];
		orig[key] = newValue;
	}
}

function sumOfValues(vec) {
	var sum = 0;
	for (var key in vec) {
		sum += vec[key];
	}
	return sum;
}

function length(vec) {
	var dist = 0;
	for (var key in vec) {
		dist += vec[key] * vec[key];
	}
	return Math.sqrt(dist);
}

function normalize(vec) {
	var len = length(vec);
	for (var key in vec) {
		vec[key] = vec[key] / len;
	}
}

function distance(v1, v2) {
	var dist = 0;
	for (var key in v1) {
		if (key in v2) {
			dist += Math.pow((v1[key] - v2[key]), 2);
		} else {
			dist += Math.pow(v1[key], 2);
		}
	}
	for (var key in v2) {
		if (!key in v1) {
			dist += Math.pow(v2[key], 2);
		}
	}
	return Math.sqrt(dist);
}