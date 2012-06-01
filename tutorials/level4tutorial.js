var flavor_unearthed_events = function(){
  var elements = new Elements(Circuit.getElements())
  var empty_sensors = elements.sensor().output('empty').elements
  var or_operators = elements.OR().elements
  var first_sensor = elements.sensor().first_connection();


  if (elements.lightbulb().input('filled').exists() && !elements.OR().output('filled').exists()){
    highlightSection(elements.lightbulb().first_connection(),  true)
    createSpeechBubble(first_sensor, getBubble(4,1))
  }

  else if (or_operators.length < 1){
    Tutorial.unhighlightSection()
    createSpeechBubble(first_sensor, getBubble(4,2))
  }

  else if (or_operators.length > 1){
    Tutorial.unhighlightSection()
    createSpeechBubble(first_sensor, getBubble(4,3))
  }

  else if (empty_sensors.length == 2 || (empty_sensors.length == 1 && elements.sensor().active_connection().exists())){
    var operator = or_operators[0]
    $.each(operator.connects,function(i, connection){
      if (connection.input){
        input = connection
        highlightSection(connection, true)
      }
    })
    createSpeechBubble(first_sensor, getBubble(4,4)) ;
  }

  else if ((empty_sensors && empty_sensors.length == 1) || elements.sensor().active_connection().exists()) {
//    highlight the remaining outgoing sensor and incoming OR
    try {highlightSection(empty_sensors[0].connects[0], true)} catch(e){} //try because it might be active
    highlightSection(Filters.find_connection(or_operators[0], 'empty', true), true)
    createSpeechBubble(first_sensor, getBubble(4,5))
  }

  else if (empty_sensors.length == 0){
    Tutorial.unhighlightSection()
    createSpeechBubble(first_sensor, getBubble(4,6))
  }

  else {
    Tutorial.unhighlightSection()
  }
}