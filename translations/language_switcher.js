var Translator = (function ($) {
  var returns = {}

  var current_language = 'EN'
  var languages = ['EN', 'FR', 'ES']
  var current_texts = {}
  var listeners = []

  returns.getText = function(){
    console.log("the arguments:", arguments)
    var i = 0;
    var text = current_texts;
    while (i < arguments.length){
      try {
        text = text[arguments[i]]
      } catch (e) {
        console.log("Error finding ", arguments[i-1],  ".  The error is ", e)
        return null
      }
      i++;
    }
    return text
  }

  returns.changeLanguage = function(language_code){
    current_language = language_code

    current_texts = hashify($('#translations #' + language_code))
    console.log("About to listen to the listeners", listeners)
    listeners.forEach(function(listener){
        listener.call()
    })

  }

  returns.list_languages = function(){
    return languages
  }

  returns.addListener = function(function_added){
    listeners.push(function_added);
  }


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

  return returns;
}(jQuery))

$(document).ready(function(){
  Translator.changeLanguage('EN')
})

//
//$(document).ready(function(){
//
//  $('#circuit').append('<div id="language">' +
//      '<div class="EN">English</div>' +
//      '<div class="FR">Francais</div>' +
//      '<div class="ES">Espanol</div>' +
//    '</div>')
//
//  //add more besides click, like touch
//  $('#circuit #language').children().on('click', function(event){
//    var text_html = $('#translations #' + this.className)
//    text_hash = hashify(text_html)
//    Tutorial.circuitChanged()
//  });
//
//  text_hash = hashify($('#translations #EN'))
//});



//var getBubble = function(tutNumber, bubbleNumber){
//
//  var command = ['tutorial' + tutNumber, 'bubble' + bubbleNumber]
//  return getText(command)
//}

//var getText = function(param_array){
//  var text = text_hash
//  $.each(param_array, function(i, param){
//    try {
//    text = text[param]
//    } catch (e) {
//      console.log("Error finding ", param, " in", param_array+ ".  The error is ", e)
//      return null
//    }
//  })
//  return text
//  //generalized function that grabs arbitrary text of arbitrary depth from
//}