var out_on_a_lemon_events = function(){
  var elements = new Elements(Circuit.getElements())
  var empty_sensors = elements.sensor().output('empty').elements
  var and_operators = elements.AND().elements
  var first_sensor = elements.sensor().first_connection();


  if (elements.lightbulb().input('filled').exists() && !elements.AND().output('filled').exists()){
    highlightSection(elements.lightbulb().first_connection(),  true)
    createSpeechBubble(first_sensor, "The only way you'll be able to solve this is by " +
        "connecting the lightbulb to the AND operator.  You may need to erase the current connection.")
  }

  else if (and_operators.length < 1){
    createSpeechBubble(first_sensor, "This time we'll be using an AND operator.  Go ahead and put one on screen.")
  }

  else if (and_operators.length > 1){
    createSpeechBubble(first_sensor, "We'll only need one AND operator for this.")
  }

  else if (empty_sensors.length == 2 || (empty_sensors.length == 1 && elements.sensor().active_connection().exists())){
    var operator = and_operators[0]
    //this should show both of them
    var input = operator.connects[0]
    $.each(operator.connects,function(i, connection){
      if (connection.input){
        input = connection
        highlightSection(connection, true)
      }
    })
    createSpeechBubble(first_sensor, "this operator has two inputs.  Select one and attach it to a sensor.") ;
  }

  else if ((empty_sensors && empty_sensors.length == 1) || elements.sensor().active_connection().exists()) {
    //highlight the remaining outgoing sensor and incoming AND
    try {highlightSection(empty_sensors[0].connects[0], true)} catch(e){} //try because it might be active
    highlightSection(Filters.find_connection(and_operators[0], '', true), true)
    createSpeechBubble(first_sensor, "Now connect the other...")
  }

  else if (empty_sensors.length == 0){
    createSpeechBubble(first_sensor, "Great!  Now if yellow AND square are both true, the AND will output true.")
  }
}