$(document).ready(function(){
	"use strict";	
	$('#hintText').hide();
	setUpLevel();
	
	$("#next").click(function(event){
	    goToPage(LevelSelector.getCurrentPage() + 1);       
    });	
	
	$("#prev").click(function(event){
	    goToPage(LevelSelector.getCurrentPage() - 1);
    });    
    
	
	function goToPage(num){
	    var pagenumber = LevelSelector.getCurrentPage();	    	
        var page = $('#page' + pagenumber);        
        event.preventDefault();
        if(num >= 0 && num <= 21){
            if(num > pagenumber){
                transitionNext(page, $('#page' + num));
	            $('#prev').fadeTo('slow', '1');
	        }
	        else{
	            transitionPrev(page, $('#page' + num));
                $('#next').fadeTo('slow', '1'); 
            }
            if(num === 0){
               $('#prev').fadeTo('slow', '0.5');
               $('#hint').fadeTo('slow', '0.5');
               $('#showLevels').fadeTo('slow', '0.5');
            }
            else if(num === 1){
               $('#prev').fadeTo('slow', '1');
               $('#hint').fadeTo('slow', '0.5');
               $('#showLevels').fadeTo('slow', '0.5');
            }
            else if(num === 21){
               $('#next').fadeTo('slow', '0.5');            
            } 
            else{
                $('#circuit').show();            
                $('#hint').fadeTo('slow', '1');
                $('#showLevels').fadeTo('slow', '1');            
                LevelSelector.setLevel(all_levels[num-2]);
            }		
            LevelSelector.setPage(num); 
            $('.hintText').hide();
	        $('#hint').text("Show Hint");
	    }
	}
	
	
	$("#showLevels").click(function(){
	    var level = LevelSelector.getCurrentLevel();
	    if(LevelSelector.getCurrentPage() !== 0 && LevelSelector.getCurrentPage() !== 1){	
	        if(level.levelid <= 10){
	            goToPage(0);
	            LevelSelector.setPage(0);	            
	        }
	        else{
	            goToPage(1);
	            LevelSelector.setPage(1);
	        }
	        if(level.complete){
	            $('#row' + level.levelid).append('<td><img id = "check" src = "../levels/images/checkmark.png"></td>');
	        }
	        $('#factory').hide();        
            $('#cliptip').hide();     
            $('#container').hide(); 
	    }
	});
	
	$('#circuit').click(function(){	        
	    $('#clipboard').animate({bottom: '-=90%'}, 1000, function(){
	        $('#clipboard').hide();
	        $('#cliptip').show();	
	        $('#clipboard').css('bottom', '-90%');
	    });	
	         
	});
	
	$("#tip").click(function(){
		$('#clipboard').show();
        $('#cliptip').hide();
        $('#clipboard').animate({ bottom: '+=90%' }, 1000, function () {
	    });        
	});
	
	$("#hint").click(function(){
	    if(LevelSelector.getCurrentPage() >= 2){
	        if($(this).text() === "Show Hint"){		
	            $('.hintText').show();
	            $(this).text("Hide Hint");
	        }
	        else{
	            $('.hintText').hide();
	            $(this).text("Show Hint");
	        }	
	    }	
	});      
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

function setUpLevel(){ 
    Placer.place();     
    $('#factory').hide();
    $('#cliptip').hide();
    makePages();
    $('.page').hide();    
    $('.hintText').hide();
    $('#page0').show();
    $('#hint').fadeTo('slow', '0.5');
    $('#showLevels').fadeTo('slow', '0.5');
    $('#prev').fadeTo('slow', '0.5');
    $('#return').fadeTo('slow', '0.5'); 
     
}

function makePages() {    
    var i = 0;
    for(var i = 0 ; i< 20; i += 1){
        var level = all_levels[i]       
        var page = $('<tr></tr>').addClass('rows').attr('id', 'row' + level.levelid);
        var page2 = $('<tr></tr>').addClass('rows').attr('id', 'row' + level.levelid);
        var order = $('<div></div>').addClass('page').attr('id', 'page' + (level.levelid + 1));     
            
        if(i <= 9){
            page.append($('<td></td>').addClass('selectName').text(level.levelid + ". " + level.levelname)); 
            $('#levels1').append(page);                              
        }
        else if(9 < i & i <=19){
            page2.append($('<td></td>').addClass('selectName').text(level.levelid + ". " + level.levelname));
            $('#levels2').append(page2);              
        }
        
        order.append($('<div></div>').addClass('levelname').text(level.levelid + ". " + level.levelname));
        order.append($('<div></div>').addClass('order').text("Order: " + level.orderText)); 
        order.append($('<div></div>').addClass('hintText').text("Hint: " + level.hint));
        $('#clipOrder').append(order); 
    }
    addLevelClicks();
}

function addLevelClicks(){
    $('#tbody1').children().each(function(i, child){
        $(child).click(function(){
            LevelSelector.setPage(i+2);
            var pagenum = LevelSelector.getCurrentPage();  
            LevelSelector.setLevel(all_levels[i]);          
            transitionNext($('#page0'), $('#page' + pagenum ));            
            $('#circuit').show();
            $('#hint').fadeTo('slow', '1');
            $('#showLevels').fadeTo('slow', '1');
            $('#prev').fadeTo('slow', '1');
            $('#return').fadeTo('slow', '1');
            $('#factory').show();
            Placer.place();
        });   
    });
    
    $('#tbody2').children().each(function(i, child){
        $(child).click(function(){
            LevelSelector.setPage(i + 12);
            var pagenum = LevelSelector.getCurrentPage();
            transitionNext($('#page1'), $('#page' + pagenum));            
            LevelSelector.setLevel(all_levels[i + 10]);
            $('#circuit').show();
            $('#hint').fadeTo('slow', '1');
            $('#showLevels').fadeTo('slow', '1');
            $('#prev').fadeTo('slow', '1');
            $('#return').fadeTo('slow', '1');
            $('#factory').show();
            Placer.place();
        });   
    });
}
