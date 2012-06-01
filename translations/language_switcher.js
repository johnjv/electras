
var Translator = (function ($) {
  var returns = {}

  var current_language = 'EN'
  var current_texts = {}
  var english_texts = {}
  var listeners = []
  var lang = 'KO'


  returns.getText = function(){
    var i = 0;
    var text = current_texts;
    var looping = false;
    while (i < arguments.length){
      if (text.hasOwnProperty(arguments[i])) {
        text = text[arguments[i]]
        i++;
      } else {
        if (looping){return arguments[arguments.length-1]}
        console.log("Error finding ", arguments[i],  ".  Replacing with English text")
        i = 0;
        text = english_texts
        looping = true
      }
    }
    return text
  }

  returns.changeLanguage = function(language_code){
    current_language = language_code
    current_texts = hashify($('#translations #' + language_code))
    $.each(listeners, function(i, listener){
        listener.call()
    })
    console.log(current_texts)
    if(language_code === 'EN'){
        lang = 'KO'
    }
    else{
        lang = 'EN'
    }
    
  }

  returns.getCurrentLanguage = function(){
     return lang; 
  }  

  returns.list_languages = function(){
    return $('#translations').children().map(function(i, child){return child.id})
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

  $(document).ready(function(){
    Translator.changeLanguage('EN')
    console.log('it got the english')
    english_texts = hashify($('#translations #EN'))
  })

  return returns;
}(jQuery))
