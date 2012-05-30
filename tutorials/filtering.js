var Filters = (function ($) {
  var my = {}

  my.find_connection = function(element, connectedTo, type){
    if(type == 'input') {
      type = true
    } else if (type == 'output') {
      type = false
    }
    return element.connects.filter(function(connection) {return connection_is_match(connection, {input: type, connectedTo: connectedTo})})[0]
  }

  my.filter_elements = function(elements, criterion){ //both criterion and elements are arrays
    var remaining_elements = elements
    $.each(criterion, function(key, value){
      remaining_elements = remaining_elements.filter(function(element){
        //filter will match up each to the criteria to create a new remaining_elements with only things that match
        return is_match(element, key, value)
      });
    });
    return remaining_elements
  };

  var is_match = function(element, key, criteria){
    var i = 0;
    switch (key) {
      case 'type': return matches_key(criteria, element.type);
      case 'sensor': return matches_key(criteria, element.type);
      case 'connects':
        var valid_connections = element.connects.filter(function(connection) {return connection_is_match(connection, criteria)}) //feed in the entire hash of connection criteria
        if (valid_connections && valid_connections.length > 0) {return true} else {return false}
      default:
    }
  }

  var connection_is_match = function(connection, criteria){  //'this' is the criterion
    var this_is_a_match = true;
    $.each(criteria, function(connection_key, connection_value) {
      switch (connection_key) {
        case 'input':
          if(connection_value != connection.input){this_is_a_match = false}
          break;
        case 'connectedTo':
          var one_matches = false;
          these_connections = connection.connectedTo.split()
          $.each(these_connections, function(i, link){

            if (test_one_link(link, connection_value)){
              one_matches = true;
            }
          })
          if (!one_matches) {this_is_a_match = false}
          break;
      }
    });
    return this_is_a_match
  }

  var test_one_link = function(link, link_value){
    if (link_value == 'filled') {
      if (test_regex('[0-9]+', link)) {return true}
    } else if (link_value == 'empty') {
      if(test_regex(('^$', link))) {return true}
    } else {
      if(matches_key(link_value, link)){return true}
    }
    return false;
  }


  var test_regex = function(regex, string) {
    var re = new RegExp(regex)
    result = re.exec(string)
    if (result && result.length > 0){
      return true;
    } else {
      return false;
    }
  }
  var matches_key = function(find_this, find_in){
    var re = new RegExp(''+find_this)
    if (re.exec(find_in)) {return true;} else {return false}
  }

  return my;
}(jQuery))

//shortcuts and standins

var highlightSection = function(highlighted, isCircular){
  var params = parametric_to_square(highlighted, isCircular)
  Tutorial.highlightSections([params])
}

var parametric_to_square = function(highlighted, isCircular){
  params = {}
  params.x = highlighted.x - highlighted.r
  params.y = highlighted.y - highlighted.r
  params.height = highlighted.r * 2
  params.width = highlighted.r * 2
  params.isCircular = isCircular
  return params
}

var highlightSections = function(params){
  Tutorial.highlightSections(params)
  //console.log("highlighting multiple sections with params: ", params)
}

var createSpeechBubble = function(hightlighted, text) {
  Tutorial.placeBubble(hightlighted, text)
  //console.log("creating speech bubble: ", hightlighted.x, hightlighted.y, text);
}

var getLeverLocation = function(){
  return {
    x: 110,
    y: 120,
    height: 130,
    width: 140
  }
}
