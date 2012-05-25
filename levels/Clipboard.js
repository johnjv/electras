$(document).ready(function(){
	"use strict";	
	
	$("#next").click(function(event){
	    var pagenumber = LevelSelector.getCurrentLevel().levelid;	
        var page = $('#page'+ pagenumber);
        event.preventDefault();
        if(pagenumber === 20){
            LevelSelector.showSelector(true);
        }
        else{
            transitionNext(page, $('#page' + (pagenumber + 1)));
            LevelSelector.advanceLevel(true);		
        }        
    });	
	
	$("#prev").click(function(event){
	    var pagenumber = LevelSelector.getCurrentLevel().levelid;	
        var page = $('#page'+ pagenumber);
        event.preventDefault();
        if(pagenumber === 1){
            LevelSelector.showSelector(true);
        }
        else{
            transitionPrev(page, $('#page' + (pagenumber - 1)));
            LevelSelector.previousLevel(true);		
        }        
    });
	
	$("#showLevels").click(function(){
		LevelSelector.showSelector(true);			
	});

	
	$("#tip").click(function(){
		$('#clipboard').show();	
		$('#clipboard').animate({
           'bottom' : "+=45%"
           }, 1000, function() {     
        }); 
        $('#cliptip').hide();   	
	});
	
	$("#return").click(function(){		
		$('#clipboard').css('bottom' , "-57%")
        $('#cliptip').show();
        $('#clipboard').hide();   	
	});
	
	$("#hint").click(function(){
		console.log("show hint here");
	});
	
	
	for(var i = 0 ; i< 20; i++){
        var level = all_levels[i];
        var page = $('<div></div>').addClass('page').attr('id', 'page' + level.levelid);
        page.append($('<div></div>').addClass('levelname').text(level.levelid + " " + level.levelname));
        page.append($('<div></div>').addClass('order').text("Order: " + level.orderText));        
        $('#clipOrder').append(page);
    }  
    $('.page').hide();
});	


function getHint(){
    var level = LevelSelector.getCurrentLevel();
    return level.hint;
}

function transitionNext(src, dst) {
	var dist;
	src.css('z-index', 2);
	dst.css('z-index', 1);
	dst.css('top', 0);
	dst.show();
	dist = $('#clipOrder').height();
	src.height(dist);
	src.stop().animate({ top: -dist + 'px' }, 1000, function () {
		src.hide();
	});
}

function transitionPrev(src, dst) {
	var dist;
	src.css('z-index', 1);
	dst.css('z-index', 2);
	dist = $('#clipOrder').height();
	dst.height(dist);
	dst.css('top', -dist + 'px');
	dst.show();
	dst.stop().animate({ top: '0px' }, 1000, function () {
		src.hide();
	});
} 
