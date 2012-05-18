function setUpLevel(){
    $('#levelSelect2').hide();
    $('#levelSelect3').hide();
    $('#right2').hide();
    $('#left2').hide();
    $('#left3').hide(); 
    
    $('#right1').click(function(){      
        $( "#levelSelect1:first" ).animate({
           'marginLeft' : "-=25%"
           }, 1000, function() {     
        });
         if(all_levels.length > 20){
             $('#right2').show();
         }         
        $( "#levelSelect2:first" ).animate({
           'marginLeft' : "-=25%"             
           }, 1000, function() {              
        }); 
         $('#levelSelect1').hide();
         $('#right1').hide();    
         $('#levelSelect2').show();
         $('#left2').show();
    });
        
    $('#left2').click(function(){        
        $( "#levelSelect1:first" ).animate({
           'marginLeft' : "+=25%"
           }, 1000, function() {
        });
        $( "#levelSelect2:first" ).animate({
           'marginLeft' : "+=25%"
           }, 1000, function() {   
        });
        $('#levelSelect1').show();
        $('#right1').show();
        $('#levelSelect2').hide();        
        $('#left2').hide();
    });
}

var LevelSelector = (function($) {
    "use strict";
    var my = {};
    var cleared = [];             
    var level = all_levels[0];
    
    $(document).ready(function () {    
       setUpLevel();
       my.makePage(cleared);
    });

    my.advanceLevel = function(finish){
        if(finish){                              
            cleared.push(level.levelid);               
        }  
        level = all_levels[level.levelid + 1];
    };

    my.showSelector = function(finish){ 
        window.location("../levels/LevelProto.html");   
        if(finish){                       
            cleared.push(level.levelid);        
        }       
        makePage(cleared);
        if(currentId <= 10){
            $('#levelSelect1').show();
            $('#arrow1').show();
            $('#title').show();
        }
        else if(currentId > 10 & currentId <= 20 ){
            $('#levelSelect2').show();
            $('#arrow2').show();
            $('#title').show();
        }
        else{
            $('#levelSelect3').show();
            $('#arrow3').show();
            $('#title').show();
        }    
    };

   my.getCurrentLevel = function(){      
      return level;
    };
    
    my.makePage = function(finished){    
        var i = 0;
        var html; 
        var levels = [];
        $("#levels1").children().remove();
        $("#levels2").children().remove();
        $("#levels3").children().remove();
        levels = level.getLevelNames();    
        for(i = 0; i < levels.length; i+=1){
            html = my.checkFinish(finished, levels[i], i+1);
            if(i <= 9){
                $('#levelSelect1').append(html);      
            }
            else if(9 < i & i <=19){
                $('#levelSelect2').append(html);
            }
            else{
                $('#levelSelect3').append(html);
            }
       }
        my.addChildClicks();       
    };    

    my.checkFinish = function(finished, levels, id){
        "use strict";
        var html, check;
        var  j = 0;   
        html = '<tr id = "row' + (id) + '"><td id=" level' + (id) + '"><b>' + (id) + '. ' + levels + '</b></td></tr>';        
        for(j = 0; j < finished.length ; j += 1){        
            if(id === finished[j]){ 
                check = '<img src = "images/checkmark.png" id = "check">';   
                html = '<tr id = "row' + (id) + '"><td id=" level' + (id) + '"><b>' + (id) + '. ' + levels + '</b>' + check + '</td></tr>';
            }
        }
        return html;
    };

    my.addChildClicks = function(){
        "use strict";
        $('#levels1').children().each(function(i, child) {
            $(child).click( function(){
                 $('#levelSelect1').hide();
                 $('#arrow1').hide(); 
                 $('#title').hide();
                 level = all_levels[i+1];                 
                 window.location = '../Floor/FactoryFloor.html';
            });
          });
          
        $('#levels2').children().each(function(i, child) {        
             $(child).click( function(){                                    
                 $('#levelSelect2').hide();  
                 $('#arrow2').hide(); 
                 $('#title').hide(); 
                 level = all_levels[i+11];                      
                 window.location = '../Floor/FactoryFloor.html';             
            });
          });
          
        $('#levels3').children().each(function(i, child) {
             $(child).click( function(){                       
                 $('#levelSelect3').hide();
                 $('#arrow3').hide(); 
                 $('#title').hide();
                 level = all_levels[i+21];                       
                 window.location = '../Floor/FactoryFloor.html';
               });
          });
    };
}(jQuery));
