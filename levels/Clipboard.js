$(document).ready(function(){
	"use strict";
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
        if(num >= 0 && num <= 23){
            if(num > pagenumber){
                transitionNext(page, $('#page' + num));
	            $('#prev').fadeTo('slow', '1');
	        }
	        else{
	            transitionPrev(page, $('#page' + num));
                $('#next').fadeTo('slow', '1'); 
            }
            if(num < 3){
               if(num === 0){
                   $('#prev').fadeTo('slow', '0.5'); 
               }
               else{
                   $('#prev').fadeTo('slow', '1'); 
               }
               $('#hint').fadeTo('slow', '0.5');
               $('#showLevels').fadeTo('slow', '0.5');
               $('#circuit').hide();
               $('#factory').hide();
            } 
            else if(num === 23){
                Credit.slideDesc();
	            var pagenumber = LevelSelector.getCurrentPage();	    	
                var page = $('#page' + pagenumber);     
                transitionNext(page, $('#page23'));
                $('#hint').fadeTo('slow', '0.5');        
                $('#circuit').hide();
                $('#factory').hide();
                LevelSelector.setPage(23); 
                $('#clipButtons').hide();
            }    
            else{                
                $('#circuit').show();
                $('#factory').show();
                Placer.place();            
                $('#hint').fadeTo('slow', '1');
                $('#showLevels').fadeTo('slow', '1');            
                LevelSelector.setLevel(all_levels[num-3]);                
            }		
            LevelSelector.setPage(num); 
            $('.hintText').hide();
            $('#hint').text("Hint");
	    }	    
	}
	
	
	$("#showLevels").click(function(){
	    var level = LevelSelector.getCurrentLevel();
	    var page = LevelSelector.getCurrentPage();
	    if(page > 2){	
	        if(level.levelid <= 10){
	            goToPage(1);
	            LevelSelector.setPage(1);	            
	        }
	        else{
	            goToPage(2);
	            LevelSelector.setPage(2);
	        }
	        if(level.complete){
	            $('#row' + level.levelid).append('<td><img id = "check" src = "../levels/images/checkmark.png"></td>');
	        }	                
            $('#cliptip').hide();     
            $('#container').hide();            
	    }
	});
	
	$('#circuit').click(function(){
	    $('#clipboard').hide();
        $('#cliptip').show();	
        $('#clipboard').css('bottom', '-90%');
        Circuit.setInterfaceEnabled(true);
	});
	
	$('#factory').click(function(){	  
	    $('#clipboard').hide();
        $('#cliptip').show();	
        $('#clipboard').css('bottom', '-90%');
	});
	
	$("#tip").click(function(){
		$('#clipboard').show();
        $('#cliptip').hide();
	    Circuit.setInterfaceEnabled(false);
	});
	
	$("#hint").click(function(){
	    if(LevelSelector.getCurrentPage() >= 3){
	        if($('#hint').text() === "Hint"){
	            $('.hintText').show();
	            $('#hint').text("Hide");
	        }
	        else{
	            $('.hintText').hide();
	            $('#hint').text("Hint");
	        }
	    }	    
	}); 
	
	$("#credits").click(function(){
	    Credit.slideDesc();
	    var pagenumber = LevelSelector.getCurrentPage();	    	
        var page = $('#page' + pagenumber);     
        transitionNext(page, $('#page23'));
        $('#hint').fadeTo('slow', '0.5');        
        $('#circuit').hide();
        $('#factory').hide();
        LevelSelector.setPage(23); 
        $('#clipButtons').hide();        
	});

    function getHint(){
        var level = LevelSelector.getCurrentLevel();
        return level.hint;
    }

   function positionPage(page) {
		var vpad, hpad;
		vpad = page.innerHeight() - page.height();
		hpad = page.innerWidth() - page.width();
		page.height(page.parent().height() - vpad);
		page.width(page.parent().width() - hpad);
		page.css('top', '-' + page.css('border-top-width'));
		page.css('left', '-' + page.css('border-left-width'));
		page.css('transform', 'scale(1)');
	}
	
	function transitionCut(src, dst) {
		positionPage(dst);
		dst.show();
		if (src) {
			src.hide();
		}
	};

	function transitionNext (src, dst) {
		var d = Math.floor(dst.parent().height() / 2);
		src.css('z-index', 52);
		dst.css('z-index', 51);
		positionPage(dst);
		dst.show();
		src.stop().animate({
			top: '-=' + d + 'px',
			transform: 'scale(1, 0.01)'
		}, 1000, function () {
			src.hide();
			src.css('z-index', 0);
		});
	};

	function transitionPrev(src, dst) {
		var d = Math.floor(dst.parent().height() / 2);
		src.css('z-index', 51);
		dst.css('z-index', 52);
		positionPage(dst);
		dst.css('top', '-=' + d + 'px');
		dst.css('transform', 'scale(1, 0.01)');
		dst.show();
		dst.stop().animate({
			top: '+=' + d + 'px',
			transform: 'scale(1)'
		}, 1000, function () {
			src.hide();
		});
	}; 

    function setUpLevel(){ 
        Placer.place(); 
        $('#cliptip').hide();
        makePages();
        $('.page').hide();    
        $('.hintText').hide();    
        $('#page0').show();    
        $('#hint').fadeTo('slow', '0.5');
        $('#showLevels').fadeTo('slow', '0.5');
        $('#prev').fadeTo('slow', '0.5');
        $('#return').fadeTo('slow', '0.5');
        $('#hintText').hide(); 
        $('#circuit').hide();
        $('#factory').hide();
        Circuit.setInterfaceEnabled(false);
        
    }

    function makePages() {    
        var i = 0;
        for(var i = 0 ; i< 20; i += 1){
            var level = all_levels[i]       
            var page = $('<tr></tr>').addClass('rows').attr('id', 'row' + level.levelid);
            var page2 = $('<tr></tr>').addClass('rows').attr('id', 'row' + level.levelid);
            var order = $('<div></div>').addClass('page').attr('id', 'page' + (level.levelid + 2));     
                
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
        $('#levels2').append($('<tr><td id = "credits">Credits</td></tr>')); 
    }

    function addLevelClicks(){
        var page, pagenum;    
        $('#tbody1').children().each(function(i, child){                                     
            $(child).click(function(){ 
                goToPage(i + 3);
                $('#circuit').show();
                $('#hint').fadeTo('slow', '1');
                $('#showLevels').fadeTo('slow', '1');
                $('#prev').fadeTo('slow', '1');
                $('#factory').show();     
                Placer.place();
            });
        });
        
        $('#tbody2').children().each(function(i, child){                                     
            $(child).click(function(){
                goToPage(i + 13);
                $('#circuit').show();
                $('#hint').fadeTo('slow', '1');
                $('#showLevels').fadeTo('slow', '1');
                $('#prev').fadeTo('slow', '1');
                $('#factory').show();
                Placer.place();
                
            });   
        });
    }
});	
