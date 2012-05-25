$(document).ready(function(){

  $('#circuit').append('<div id="language">' +
      '<div class="EN">English</div>' +
      '<div class="FR">Francais</div>' +
      '<div class="ES">Espanol</div>' +
    '</div>')

  //add more besides click, like touch
  $('#circuit #language').children().on('click', function(event){
    var text_html = $('#translations #' + this.className)
    text_hash = hashify(text_html)
    Tutorial.circuitChanged()
  });

  text_hash = hashify($('#translations #EN'))
});

var hashify = function(html){
  if ($(html).children().length > 0){
    var new_hash = {}
    $(html).children().each(function(i, child){
      new_hash[child.className] = hashify(child)
    })
    return new_hash
  } else {
    return $(html).text()
  }
}


var getBubble = function(tutNumber, bubbleNumber){

  var command = ['tutorial' + tutNumber, 'bubble' + bubbleNumber]
  return getText(command)
}

var getText = function(param_array){
  var text = text_hash
  $.each(param_array, function(i, param){
    try {
    text = text[param]
    } catch (e) {
      console.log("Error finding ", param, " in", param_array+ ".  The error is ", e)
      return null
    }
  })
  return text
  //generalized function that grabs arbitrary text of arbitrary depth from
}