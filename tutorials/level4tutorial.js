var i_mint_chocolate = function(){
  var elements = getElements();
  var empty_sensors = filter_elements(elements, sensor('', 'empty'))
  var has_incoming_active_or = has_element_where(elements, OR('incoming', 'active'))
  var or_operators = filter_elements(elements, OR('', ''))

  if (or_operators.length < 1){
    createSpeechBubble(filter_elements(elements, lightbulb('')), "This time we'll be using an OR operator.  Go ahead and put one on screen.")
  }

  else if (or_operators.length > 1){
    createSpeechBubble(or_operators[0], "We'll only need one OR operator for this.")
  }

  else if (empty_sensors.length == 2 && !has_incoming_active_or){
    var operator = or_operators[0]
    //this should show both of them
    var input = operator.connections[0]
    $.each(operators.connections,function(i, connection){
      if (connection.type == 'incoming'){
        input = connection
        highlightSection(connection, true)
      }
    })
    createSpeechBubble(input, "this operator has two inputs.  Select one.") ;
  }

  else if (empty_sensors.length == 2 && has_incoming_active_or){
    //highlight two sensor outgoings
    var sensors = filter_elements(sensor('', ''))
    highlightSection(empty_sensors[0].connections[0], true)
    highlightSection(empty_sensors[1].connections[0], true)
  }

  else if (empty_sensors.length == 1 &&
      (has_element_where(elements, OR('incoming', 'empty')) ||
          has_element_where(elements, sensor('', 'empty')))) {
    //highlight the remaining outgoing sensor and incoming OR
  }

  else if (empty_sensors.length == 0){
    //just show a speech bubble
  }


}