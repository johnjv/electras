var i_mint_chocolate_events = function(){
  var elements = new Elements(making_first_connection) //getElements();
  var empty_sensors = elements.sensor().empty('outgoing').elements
  var has_incoming_active_or = elements.OR().input('active').exists()
  var or_operators = elements.OR().elements

  if (or_operators.length < 1){
    createSpeechBubble(elements.lightbulb('').first_connection(), "This time we'll be using an OR operator.  Go ahead and put one on screen.")
  }

  else if (or_operators.length > 1){
    createSpeechBubble(or_operators[0].connections[0], "We'll only need one OR operator for this.")
  }

  else if (empty_sensors.length == 2 && !has_incoming_active_or){
    var operator = or_operators[0]
    //this should show both of them
    var input = operator.connections[0]
    $.each(operator.connections,function(i, connection){

      if (connection.connection_type == 'incoming'){
        input = connection
        highlightSection(connection, true)
      }
    })
    createSpeechBubble(input, "this operator has two inputs.  Select one.") ;
  }

  else if (empty_sensors.length == 2 && has_incoming_active_or){
    //highlight two sensor outgoings
//    var sensors = elements.sensor('').elements
    highlightSection(empty_sensors[0].connections[0], true)
    highlightSection(empty_sensors[1].connections[0], true)
  }

  else if (empty_sensors.length == 1 && elements.OR().empty('incoming').exists()) {
    //highlight the remaining outgoing sensor and incoming OR
  }

  else if (empty_sensors.length == 0){
    //just show a speech bubble
  }
}

var start4 = [
    test_lightbulb(''),
    test_sensor(2, 'mint', ''),
    test_sensor(3, 'chocolate', '')
]

var one_empty_OR = [
  test_lightbulb(''),
  test_sensor(2, 'mint', ''),
  test_sensor(3, 'chocolate', ''),
  test_OR(4, '', '', '')
]

var two_ORs = [
  test_lightbulb(''),
  test_sensor(2, 'mint', ''),
  test_sensor(3, 'chocolate', ''),
  test_OR(4, '', '', ''),
  test_OR(5, '', '', '')
]

var making_first_connection = [
  test_lightbulb(''),
  test_sensor(2, 'mint', ''),
  test_sensor(3, 'chocolate', ''),
  test_OR(4, 'active', '', '')
]