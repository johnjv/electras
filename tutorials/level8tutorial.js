var out_on_a_lemon_events = function(){
  var elements = new Elements(Circuit.getElements())
  var empty_sensors = elements.sensor().output('empty').elements
  var and_operators = elements.AND().elements
  var first_sensor = elements.sensor().first_connection();


  if (elements.lightbulb().input('filled').exists() && !elements.AND().output('filled').exists()){
    highlightSection(elements.lightbulb().first_connection(),  true)
    createSpeechBubble(first_sensor, getBubble(8,1))
  }

  else if (and_operators.length < 1){
    Tutorial.unhighlightSection()
    createSpeechBubble(first_sensor, getBubble(8,2))
  }

  else if (and_operators.length > 1){
    Tutorial.unhighlightSection()
    createSpeechBubble(first_sensor, getBubble(8,3))
  }

  else if (empty_sensors.length == 2 || (empty_sensors.length == 1 && elements.sensor().active_connection().exists())){
    var operator = and_operators[0]
    $.each(operator.connects,function(i, connection){
      if (connection.input){
        input = connection
        highlightSection(connection, true)
      }
    })
    createSpeechBubble(first_sensor, getBubble(8,4)) ;
  }

  else if ((empty_sensors && empty_sensors.length == 1) || elements.sensor().active_connection().exists()) {
    //highlight the remaining outgoing sensor and incoming AND
    try {highlightSection(empty_sensors[0].connects[0], true)} catch(e){} //try because it might be active
    highlightSection(Filters.find_connection(and_operators[0], '', true), true)
    createSpeechBubble(first_sensor, getBubble(8,5))
  }

  else if (empty_sensors.length == 0){
    Tutorial.unhighlightSection()
    createSpeechBubble(first_sensor, getBubble(8,6))
  }

  else {
    Tutorial.unhighlightSection()
  }
}