var Filters = (function ($) {
	var my = {};

	my.find_connection = function (element, connectedTo, type) {
		if (type == 'input') {
			type = true;
		} else if (type == 'output') {
			type = false;
		}
		return element.connects.filter(function (connection) {
			return connection_is_match(connection, {input: type, connectedTo: connectedTo});
		})[0];
	};

	my.filterByType = function (elements, type) {
		var result, re;
		re = new RegExp('^' + type + '$');
		result = [];
		$.each(elements, function (i, elt) {
			if (re.test(elt.type)) {
				result.push(elt);
			}
		});
		return result;
	};

	my.filter_elements = function (elements, criterion) { //both criterion and elements are arrays
		var remaining_elements = elements;
		$.each(criterion, function (key, value) {
			remaining_elements = remaining_elements.filter(function (element) {
				//filter will match up each to the criteria to create a new remaining_elements with only things that match
				return is_match(element, key, value);
			});
		});
		return remaining_elements;
	};

	var is_match = function (element, key, criteria) {
		var i = 0;
		switch (key) {
		case 'type':
			return matches_key(criteria, element.type);
		case 'sensor':
			return matches_key(criteria, element.type);
		case 'connects':
			var valid_connections = element.connects.filter(function (connection) {
				return connection_is_match(connection, criteria);
			}); //feed in the entire hash of connection criteria
			return valid_connections && valid_connections.length > 0;
		}
	};

	var connection_is_match = function (connection, criteria) {	//'this' is the criterion
		var this_is_a_match = true;
		$.each(criteria, function (connection_key, connection_value) {
			switch (connection_key) {
			case 'input':
				if (connection_value != connection.input) {
					this_is_a_match = false;
				}
				break;
			case 'connectedTo':
				var one_matches = false;
				these_connections = connection.connectedTo.split();
				$.each(these_connections, function (i, link) {

					if (test_one_link(link, connection_value)) {
						one_matches = true;
					}
				});
				if (!one_matches) {
					this_is_a_match = false;
				}
				break;
			}
		});
		return this_is_a_match;
	};

	var test_one_link = function (link, link_value) {
		if (link_value == 'filled') {
			return test_regex('[0-9]+', link);
		} else if (link_value == 'empty') {
			return test_regex('^$', link);
		} else {
			return matches_key(link_value, link);
		}
	};

	var test_regex = function (regex, query) {
		var result = (new RegExp(regex)).exec(query);
		return result && result.length > 0;
	};

	var matches_key = function (find_this, find_in) {
		return (new RegExp(''+find_this)).exec(find_in);
	};

	return my;
}(jQuery));
