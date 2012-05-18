var page1 = true;        //determines if showSelector should be on this page or not
var page2 = false;       //determines if showSelector should be on this page or not
var page3 = false;       //determines if showSelector should be on this page or not
var cleared = [];        //the array of all the levels that have been successfully finished
var curid = 0;           //the current level that the user is on
var Level = new Level;   //call of the level class so we may use it throughout the file
    

$(document).ready(function () {    
    
    $('#right1').click(function(){
        page1 = false;
        page2 = true;        
        page3 = false;        
        $( "#levelSelect1:first" ).animate({
           'marginLeft' : "-=25%"
           }, 1000, function() {     
        });
        $('#levelSelect1').hide();
        $('#right1').hide();
    
         $('#levelSelect2').show();
         if(all_levels.length > 20){
             $('#right2').show();
         }
         $('#left2').show();
        $( "#levelSelect2:first" ).animate({
           'marginLeft' : "-=25%"             
           }, 1000, function() {
              
        });
    
        $( "#levelSelect3:first" ).animate({
           'marginLeft' : "-=25%"
           }, 1000, function() {
        });
        $('#levelSelect3').hide();  
    });
        
    $('#left2').click(function(){
        page1 = true;
        page2 = false;        
        page3 = false;        
        $( "#levelSelect1:first" ).animate({
           'marginLeft' : "+=25%"
           }, 1000, function() {     
        });
        $('#levelSelect1').show();
        $('#right1').show(); 
        
        $('#levelSelect2').show();
        $( "#levelSelect2:first" ).animate({
           'marginLeft' : "+=25%"
           }, 1000, function() {   
        });
        $('#levelSelect2').hide();
        $('#right2').hide();
        $('#left2').hide();
    
        $( "#levelSelect3:first" ).animate({
           'marginLeft' : "+=25%"
           }, 1000, function() {
        });
        $('#levelSelect3').hide();  
    });
    
    $('#right2').click(function(){
        page1 = false;
        page2 = false;        
        page3 = true; 
         $( "#levelSelect1:first" ).animate({
           'marginLeft' : "-=25%"
           }, 1000, function() {     
        });
        $('#levelSelect1').hide();
        $('#right1').hide(); 
        
        $('#levelSelect2').show();
        $( "#levelSelect2:first" ).animate({
           'marginLeft' : "-=25%"
           }, 1000, function() {   
        });
        $('#levelSelect2').hide();
        $('#right2').hide();
        $('#left2').hide();
    
        $('#levelSelect3').show();
        $('#left3').show();
        $( "#levelSelect3:first" ).animate({
           'marginLeft' : "-=25%"
           }, 1000, function() {
        });        
    });      
    
    
    $('#left3').click(function(){
        page1 = false;
        page2 = true;        
        page3 = false; 
        $( "#levelSelect1:first" ).animate({
           'marginLeft' : "+=25%"
           }, 1000, function() {     
        });
        $('#levelSelect1').hide(); 
        $('#right1').hide(); 
        
        $('#levelSelect2').show();
        $( "#levelSelect2:first" ).animate({
           'marginLeft' : "+=25%"
           }, 1000, function() {   
        });
        $('#levelSelect2').show();
        $('#right2').show();
        $('#left2').show();
    
        $( "#levelSelect3:first" ).animate({
           'marginLeft' : "+=25%"
           }, 1000, function() {
        });
        $('#levelSelect3').hide();
        $('#left3').hide();        
    });    
    
    $('#select').click(function(){
        showSelector(curid, true);
        $(this).hide();
        $('#testLevel').html("");
        $('#testLevel').hide();
        $('#analysis').html("");
        $('#analysis').hide();
    }); 
          
    $('#next').click(function(){        
        $('#testLevel').html("");
        $('#analysis').html(""); 
        $('#prev').show();
        advanceLevel(curid, true);                      
    });  
    
    $('#prev').click(function(){
        $('#testLevel').html("");
        $('#analysis').html("");
        $('#next').show(); 
        prevLevel(curid, true);              
    });     
           
    makePage(cleared);     
    $('#levelSelect2').hide();
    $('#levelSelect3').hide();
    $('#right2').hide();
    $('#left2').hide();
    $('#left3').hide();
    $('#select').hide();
    $('#next').hide();
    $('#testLevel').hide();
    $('#analysis').hide("");
    $('#prev').hide();
});


function advanceLevel(levelid, finish){   
    if(finish){                              
        cleared.push(levelid);               
    }  
    levelid += 1;               
    getCurrentLevel(levelid);
    curid = levelid;            
}


function prevLevel(levelid, finish){   
    if(finish){                              
        cleared.push(levelid);               
    }  
    levelid -= 1;               
    getCurrentLevel(levelid);
    curid = levelid;            
}


function showSelector(levelid, finish){    
    if(finish){                       
        cleared.push(levelid);        
    }
    $('#next').hide();
    $('#prev').hide();    
    makePage(cleared);
    if(page1){
        $('#levelSelect1').show();
        $('#arrow1').show();
        $('#title').show();
    }
    if(page2){
        $('#levelSelect2').show();
        $('#arrow2').show();
        $('#title').show();
    }
    if(page3){
        $('#levelSelect3').show();
        $('#arrow3').show();
        $('#title').show();
    }    
}


function getCurrentLevel(levelid){
      var level = Level.getMe(levelid);
      if(levelid === all_levels.length){
          $('#next').hide();          
      }
      if(levelid === 1){
          $('#prev').hide();          
      }
      $('#testLevel').append('<tr><td><b> Level: ' + level.levelname + '</b></td></tr>');
      $('#testLevel').append('<tr><td><b> Order: ' + level.orderText + '</b></td></tr>');
      $('#testLevel').append('<tr><td><b> Hint: '  + level.hint      + '</b></td></tr>');
      $('#testLevel').append('<tr><td><b> Sensors: ' + level.sensors + '</b></td></tr>');
      $('#testLevel').append('<tr><td><b> Tools: ' + level.tools  + '</b></td></tr>');
      $('#testLevel').append('<tr><td><b> Types: ' + level.types + '</b></td></tr>');
      $('#testLevel').append('<tr><td><b> Script: ' + level.script + '</b></td></tr>');
      $('#testLevel').append('<tr><td><b> Answers: ' + level.answers + '</b></td></tr>');     
      
      
      $('#analysis').append('<b> Analysis: ' + level.analysis[0].type + " " + level.analysis[0].levelSays + " " + level.analysis[0].circuitSays.accept + '</b>'); 
      $('#analysis').append('<li><b> Analysis: ' + level.analysis[1].type + " " + level.analysis[1].levelSays + " " + level.analysis[1].circuitSays.accept + '</b></li>');    
      $('#analysis').append('<li><b> Analysis: ' + level.analysis[2].type + " " + level.analysis[2].levelSays + " " + level.analysis[2].circuitSays.accept + '</b></li>'); 
      $('#analysis').append('<li><b> Analysis: ' + level.analysis[3].type + " " + level.analysis[3].levelSays + " " + level.analysis[3].circuitSays.accept + '</b></li>');    
      $('#analysis').append('<li><b> Analysis: ' + level.analysis[4].type + " " + level.analysis[4].levelSays + " " + level.analysis[4].circuitSays.accept + '</b></li>'); 
      $('#analysis').append('<li><b> Analysis: ' + level.analysis[5].type + " " + level.analysis[5].levelSays + " " + level.analysis[5].circuitSays.accept + '</b></li>');    
      $('#analysis').append('<li><b> Analysis: ' + level.analysis[6].type + " " + level.analysis[6].levelSays + " " + level.analysis[6].circuitSays.accept + '</b></li>'); 
      $('#analysis').append('<li><b> Analysis: ' + level.analysis[7].type + " " + level.analysis[7].levelSays + " " + level.analysis[7].circuitSays.accept + '</b></li>');       
      return Level.getMe(levelid);    
}


function makePage(finished){
    var i = 0; 
    var levels = []   
    deleteTables();          
    levels = Level.getLevelNames();    
    for(i = 0; i < levels.length; i+=1){
        html = checkFinish(finished, levels[i].levelname, levels[i].levelid);
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
   addChildClicks();
}


function checkFinish(finished, levels, id){
    var  j = 0;   
    html = '<tr id = "row' + (id) + '"><td id=" level' + (id) + '"><b>' + (id) + ". " + levels + '</b></td></tr>';        
    for(j = 0; j < finished.length ; j += 1){        
        if(id === finished[j]){ 
            check = '<img src = "checkmark.png" id = "check">';   
            html = '<tr id = "row' + (id) + '"><td id=" level' + (id) + '"><b>' + (id) + ". " + levels + '</b>' + check + '</td></tr>';
        }
    }
    return html;
}


function deleteTables(){
    var Table1 = document.getElementById("levelSelect1"); 
    var Table2 = document.getElementById("levelSelect2");
    var Table3 = document.getElementById("levelSelect3");
       while(Table1.rows.length>0) 
           Table1.deleteRow(Table1.rows.length-1);
       while(Table2.rows.length>0) 
           Table2.deleteRow(Table2.rows.length-1);
       while(Table3.rows.length>0) 
           Table3.deleteRow(Table3.rows.length-1);           
}


function addChildClicks(){
   $('#levels1').children().each(function(i, child) {
        $(child).click( function(){ 
             curid = i + 1;              
             $('#levelSelect1').hide();
             $('#arrow1').hide(); 
             $('#title').hide();
             $('#next').show();
             $('#prev').show();
             getCurrentLevel(curid);
             $('#testLevel').show();
             $('#analysis').show();
             $('#select').show();
        });
      });
      
    $('#levels2').children().each(function(i, child) {        
         $(child).click( function(){ 
             curid  = i + 11;                       
             $('#levelSelect2').hide();  
             $('#arrow2').hide(); 
             $('#title').hide();
             $('#next').show(); 
             $('#prev').show();          
             getCurrentLevel(curid);
             $('#testLevel').show();
             $('#analysis').show();
             $('#select').show();
        });
      });
      
    $('#levels3').children().each(function(i, child) {
         $(child).click( function(){
             curid = i + 21;             
             $('#levelSelect3').hide();
             $('#arrow3').hide(); 
             $('#title').hide();
             $('#next').show();
             $('#prev').show();
             getCurrentLevel(curid);
             $('#testLevel').show();
             $('#analysis').show();
             $('#select').show();
           });
      });
}
