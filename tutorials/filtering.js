find_connection = function(element, status, type){
  return $.each(element.connections,function(i, connection){
    if (connection.type == type && connection.connected_to == status){
      return connection
    }
  })[0]
}

var find_incoming = function(element, status){return find_connection(element, status, 'incoming')}
var find_outgoing = function(element, status){return find_connection(element, status, 'outgoing');}

var filter_elements = function(elements, criterion){ //both criterion and elements are arrays
  var remaining_elements = elements
  $.each(criterion, function(key, value){
    remaining_elements = remaining_elements.filter(function(element){
      //filter will match up each to the criteria to create a new remaining_elements with only things that match
      return is_match(element, key, value)
    });
  });
  return remaining_elements
};
//
//var has_element_where = function(elements, criterion){
//  var element_matches = filter_elements(elements, criterion);
//  if (element_matches.length > 0) {
//    return true;
//  } else {
//    return false;
//  }
//}

var is_match = function(element, key, value){
  var i = 0;
  switch (key) {
    case 'type': return matches_key(value, element.type);
    case 'sensor': return matches_key(value, element.type);
    case 'connection_criteria':
      var valid_connections = element.connections.filter(connection_is_match, value) //feed in the entire hash of connection criteria
      if (valid_connections.length > 0) {return true} else {return false}
    default:
  }
}

var connection_is_match = function(connection){  //'this' is the criterion
  var this_is_a_match = true;
  $.each(this, function(connection_key, connection_value) {
    console.log('checking connection', connection, this_is_a_match)
    switch (connection_key) {
      case 'connection_type':
        this_is_a_match *= matches_key(connection_value, connection.type); //yes, you can multiply booleans
        break;
      case 'connected_to':
        if (connection_value == 'any') {
          this_is_a_match *= test_regex('[0-9]+', connection.connected_to)
          break;
        } else if (connection_value == 'empty') {
          console.log('it reached the empty!', connection)
          this_is_a_match *= test_regex(('^$', connection.connected_to))
          console.log('is it a match?', this_is_a_match, connection)
        } else {
          this_is_a_match *= matches_key(connection_value, connection.connected_to);
          break;
        }
    }
  });
  if (this_is_a_match == true || this_is_a_match == 1){
    return true
  } else {
    return false
  }
}

var test_regex = function(regex, string) {
  var re = new RegExp(regex)
  result = re.exec(string)
  if (result.length > 0){
    return true;
  } else {
    return false;
  }
}
var matches_key = function(find_this, find_in){
  var re = new RegExp(''+find_this)
  if (re.exec(find_in)) {return true;} else {return false}
}

//shortcuts and standins

var highlightSection = function(highlighted, isCircular){
  console.log("highlighting: ", highlighted.x, highlighted.y, highlighted.height, highlighted.width, isCircular)
}

var createSpeechBubble = function(hightlighted, text) {
  console.log("creating speech bubble: ", hightlighted.x, hightlighted.y, text);
}

var getLeverLocation = function(){
  return {
    x: 110,
    y: 120,
    height: 130,
    width: 140
  }
}
//
//var operator = function(type, connection_type, connection_status){
//  return {
//    type: type,
//    connection_criteria: {
//      connection_type: connection_type,
//      connected_to: connection_status
//    }
//  }
//}

//var NOT = function(connection_type, connection_status){
//  return operator('NOT', connection_type, connection_status);
//}
//
//var AND = function(connection_type, connection_status){
//  return operator('AND', connection_type, connection_status)
//}
//
//var OR = function(connection_type, connection_status){
//  return operator('OR', connection_type, connection_status)
//}

//var sensor = function(flavor, connection_status){
//  return {
//    type: 'sensor',
//    sensor: flavor,
//    connection_criteria: {
//      connected_to: connection_status
//    }
//  };
//}

var exists = function(elements){
  console.log(elements)
  return elements.length > 0;
}
var type = function(type, elements){
  return filter_elements(elements, {type: type})
}

var all_connected_to = function(id, elements){
  return filter_elements(elements, {connections: {connected_to: id}})
}

var empty_input = function(elements){
  return filter_elements(elements, {connection_criteria: {type: 'incoming', connected_to: 'empty'}})
}

var empty_output = function(elements){
  console.log(elements)
  return filter_elements(elements, {connection_criteria: {type: 'outgoing', connected_to: 'empty'}})
}

var active_connection = function(elements){
  return filter_elements(elements, {connection_criteria: {connected_to: 'active'}})
}

var filled_input = function(elements){
  return filter_elements(elements, {connection_criteria: {type: 'incoming', connected_to: 'any'}})
}

var filled_output = function(elements){
  return filter_elements(elements, {connection_criteria: {type: 'outgoing', connected_to: 'any'}})
}
var id = function(id, elements){
  return filter_elements(elements, {id: id})[0]
}

//var lightbulb = function(connection_status){
//  return {
//    type: 'lightbulb',
//    connection_criteria: {
//      connected_to: connection_status
//    }
//  }
//}
//
//
