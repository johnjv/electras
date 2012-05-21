var Filters = (function ($) {
  var my = {}

  my.find_connection = function(element, status, type){
    return (element.connections.filter(connection_is_match, type).filter(connection_is_match, status))[0]
  }

  my.filter_elements = function(elements, criterion){ //both criterion and elements are arrays
//
//    var remaining_elements =  $.filter(elements, function(key, value){
//      return filter_one_element(value, criterion)
//    })
//    console.log(remaining_elements)
    var remaining_elements = elements
    $.each(criterion, function(key, value){
      remaining_elements = remaining_elements.filter(function(element){
        //filter will match up each to the criteria to create a new remaining_elements with only things that match
        return is_match(element, key, value)
      });
    });
    return remaining_elements
  };

  var filter_one_element = function(element, criterion){
    var accepted = true;
    $.each(criterion, function(key, value){
      if (!is_match(element, key, value)){
        accepted = false;
      }
    })
    return accepted;
  }


  var is_match = function(element, key, value){
    var i = 0;
    switch (key) {
      case 'type': return matches_key(value, element.type);
      case 'sensor': return matches_key(value, element.type);
      case 'connection_criteria':
          console.log("connection criteria!", element, value)
        var valid_connections = element.connections.filter(connection_is_match, value) //feed in the entire hash of connection criteria
        if (valid_connections && valid_connections.length > 0) {return true} else {return false}
      default:
    }
  }

  var connection_is_match = function(connection){  //'this' is the criterion
    var this_is_a_match = true;
    $.each(this, function(connection_key, connection_value) {
      console.log(this, connection, connection_key, connection_value)
      switch (connection_key) {
        case 'connection_type':
          this_is_a_match *= matches_key(connection_value, connection.type); //yes, you can multiply booleans
          break;
        case 'connected_to':
          if (connection_value == 'filled') {
            this_is_a_match *= test_regex('[0-9]+', connection.connected_to)
            break;
          } else if (connection_value == 'empty') {
            this_is_a_match *= test_regex(('^$', connection.connected_to))
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
  Tutorial.highlightSection(highlighted.x, highlighted.y, highlighted.height, highlighted.width, isCircular)
  console.log("highlighting: ", highlighted.x, highlighted.y, highlighted.height, highlighted.width, isCircular)
}

var createSpeechBubble = function(hightlighted, text) {
//  Tutorial.placeBubble(hightlighted, text)
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
