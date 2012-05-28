var soyl_not_green_events = function(){
  var elements = new Elements(Circuit.getElements());
  var first_sensor = elements.sensor().first_connection();


  if (elements.lightbulb().input('filled').exists() && !elements.NOT().output('filled').exists()){
    highlightSection(elements.lightbulb().first_connection(),  true)
    createSpeechBubble(first_sensor, getBubble(3, 1))
  }

  else if (!elements.NOT().exists()){
    Tutorial.unhighlightSection()
    createSpeechBubble(first_sensor, getBubble(3,2))
  }

  else if (elements.NOT() && elements.NOT().elements.length > 1){
    Tutorial.unhighlightSection()
    createSpeechBubble(first_sensor, getBubble(3,3))
  }

  else if (elements.NOT().input('empty').exists()){
    //must find a way to capture the INPUT, not the OUTPUT
    var operator_input = Filters.find_connection(elements.NOT().elements[0], 'empty', 'input')//find_incoming(elements.NOT().input('empty'), 'empty')
    var sensor_output = Filters.find_connection(elements.sensor('G').elements[0], 'empty', 'output')
    highlightSections([parametric_to_square(operator_input, true), parametric_to_square(sensor_output, true)])
//    highlightSection(operator_input, true)
//    highlightSection(sensor_output, true)
    createSpeechBubble(first_sensor, getBubble(3,4)) ;
  }

  else if (elements.NOT().input('filled').exists() &&
      (elements.NOT().output('empty').exists() || elements.lightbulb().input('empty').exists())) {
    //if the first part of the operator is filled in, but either the outgoing part of the NOT operator or the incoming part of the lightbulb is still empty
    var operator_output = Filters.find_connection(elements.NOT().output('empty').elements[0], 'empty', 'output')
    var lightbulb_input = elements.lightbulb().first_connection()
    highlightSections([parametric_to_square(operator_output, true), parametric_to_square(lightbulb_input, true)])
//    highlightSection(operator_output, true)
//    highlightSection(lightbulb_input, true)
    createSpeechBubble(first_sensor, getBubble(3,5))
  }

  else {
    Tutorial.unhighlightSection()
  }
}