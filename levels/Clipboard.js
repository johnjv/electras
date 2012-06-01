$(document).ready(function(){
	"use strict";
	setUpLevel();	
	var next = $('#next');
	var prev = $('#prev');
	var show = $("#showLevels");
	var circuit = $('#circuit');
	var factory = $('#factory');
	var tip = $("#tip");
	var hint = $("#hint");
	var credits = $('#credits');
	var ret = $('#return');
	var sound = $('#sound');
	var lang = $('#lang');

	function Next(e) {
	    e.preventDefault();
	};
	
	Next.prototype.onRelease = function (e) {
	    if(e.isTap){
	        e.preventDefault();	        
	        checkComplete(); 
		    goToPage(LevelSelector.getCurrentPage() + 1);
		}    
	};
    multidrag.register(next, Next);
	
	function Prev(e) {
	    e.preventDefault();
	};
		
	Prev.prototype.onRelease = function (e) {
	    if(e.isTap){
	        e.preventDefault();	        
	        checkComplete();
		    goToPage(LevelSelector.getCurrentPage() - 1);
		     
		}   
	};
    multidrag.register(prev, Prev);
	
	function ShowLevels(e) {
	    e.preventDefault();
	};
			
	ShowLevels.prototype.onRelease = function (e) {
	    if(e.isTap){
	        e.preventDefault();
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
	            checkComplete();                
                $('#cliptip').hide();     
                $('#container').hide();            
	        } 
	    }  
	};
    multidrag.register(show, ShowLevels);
	
	function Circ(e) {
	    e.preventDefault();
	};
		
	Circ.prototype.onRelease = function (e) {
	    if(e.isTap){
	        e.preventDefault();
		    $('#clipboard').hide();
            $('#cliptip').show();            
            Circuit.setInterfaceEnabled(true); 
        } 
	};
    multidrag.register(circuit, Circ);
	
	function Factory(e) {
	    e.preventDefault();
	};
		
	Factory.prototype.onRelease = function (e) {
	    if(e.isTap){
	        e.preventDefault();
		    $('#clipboard').hide();
            $('#cliptip').show();           
        }   
	};
    multidrag.register(factory, Factory);
	
	function Tip(e) {
	    e.preventDefault();
	};
		
	Tip.prototype.onRelease = function (e) {
	    if(e.isTap){
	        e.preventDefault();
		    $('#clipboard').show();
            $('#cliptip').hide();
	        Circuit.setInterfaceEnabled(false);
	    }  
	};
    multidrag.register(tip, Tip);
		
	function Hint(e) {
	    e.preventDefault();
	};	
		
	Hint.prototype.onRelease = function (e) {
	    if(e.isTap){
	        e.preventDefault();
		    if(LevelSelector.getCurrentPage() >= 3){	           
	                $('.hintText').show();
	        }
	    }
	};
    multidrag.register(hint, Hint);
	
	function Credits(e) {
	    e.preventDefault();
	};
			
	Credits.prototype.onRelease = function (e) {
	    if(e.isTap){
	        e.preventDefault();
		    goToCredits();        
	    }
	};
    multidrag.register(credits, Credits);
    
    function Sound(e) {        
	    e.preventDefault();
	};
			
	Sound.prototype.onRelease = function (e) {
	    if(e.isTap){
	        e.preventDefault();
	        /*FactoryFloor.getSoundState();
	        if(FactoryFloor.getSoundState()){
		        sound.attr('src', '../levels/images/soundoff.png');
		        FactoryFloor.setSoundState(false);
		    }
		    else{
		        sound.attr('src', '../levels/images/soundon.png');
		        FactoryFloor.setSoundState(true);
		    }*/
	    }
	};
    multidrag.register(sound, Sound);
    
    function Language(e) {        
	    e.preventDefault();
	};
			
	Language.prototype.onRelease = function (e) {
	    if(e.isTap){
	        e.preventDefault();
	        Translator.changeLanguage(Translator.getCurrentLanguage());
		    //can only go from English to Korean, but cannot go back to English
	    }
	};
    multidrag.register(lang, Language);
    
    function getHint(){
        var level = LevelSelector.getCurrentLevel();
        return level.hint;
    }
    
    function goToCredits(){
        Credit.slideDesc();
        var pagenumber = LevelSelector.getCurrentPage();	    	
        var page = $('#page' + pagenumber);     
        transitionNext(page, $('#page23'));
        $('#hint').fadeTo('slow', '0.5');        
        $('#circuit').hide();
        $('#factory').hide();
        LevelSelector.setPage(23); 
        $('#hint').hide();         
        $('#prev').hide();         
        $('#next').hide();
        $('#sound').hide();
        show.hide(); 
    }
    
    function goToPage(num){
	    var pagenumber = LevelSelector.getCurrentPage();	    	
        var page = $('#page' + pagenumber); 
        if(num === 23){
            goToCredits();      
        }       
        if(num >= 0 && num <= 22){
            LevelSelector.setPage(num);
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
            else{                
                $('#circuit').show();
                $('#factory').show();
                Placer.place();            
                $('#hint').fadeTo('slow', '1');
                $('#showLevels').fadeTo('slow', '1');            
                LevelSelector.setLevel(all_levels[num-3]);                
            }            
            $('.hintText').hide();
            $('#hint').text("Hint");
            var paper = $('#paper_sound')[0];
	        paper.play();
	        //playSound(paper);
	    }	    
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
        makePages();
        Translator.addListener(makePages);
        $('#hint').fadeTo('slow', '0.5');
        $('#showLevels').fadeTo('slow', '0.5');
        $('#prev').fadeTo('slow', '0.5');
        $('#cliptip').hide();       
        $('#circuit').hide();
        $('#factory').hide(); 
        Circuit.setInterfaceEnabled(false);
    }
    
    
    function makePages() {    
        var i = 0;
        $('#tbody1').empty();
        $('#tbody2').empty();
        $('#orders').empty();        
        for(var i = 0 ; i< 20; i += 1){
            var level = all_levels[i]       
            var page = $('<tr></tr>').addClass('rows').attr('id', 'row' + level.levelid);
            var page2 = $('<tr></tr>').addClass('rows').attr('id', 'row' + level.levelid);            
            var order = $('<div></div>').addClass('page').attr('id', 'page' + (level.levelid + 2));     
                
            if(i <= 9){                
                page.append($('<td></td>').addClass('selectName').text(level.levelid + ". " + Translator.getText('levels', level.levelname))); 
                page.append($('<td></td>').addClass('checkmark').text(""));               
                $('#levels1').append(page);                              
            }
            else {                
                page2.append($('<td></td>').addClass('selectName').text(level.levelid + ". " + Translator.getText('levels', level.levelname))); 
                page2.append($('<td></td>').addClass('checkmark').text(""));
                $('#levels2').append(page2);              
            }            
            order.append($('<div></div>').addClass('levelname').text(level.levelid + ". " + Translator.getText('levels', level.levelname)));            
            order.append($('<div></div>').addClass('order').text("Order: " + Translator.getText('levels', level.orderText)));            
            order.append($('<div></div>').addClass('hintText').text("Hint: " + Translator.getText('levels', level.hint)));
            order.append($('<div></div>').addClass('complete').text("Complete"));
            $('#orders').append(order);             
        }
        addLevelClicks();       
        $('#levels2').append($('<tr><td id = "credits">Credits</td></tr>'));
        $('.page').hide();    
        $('.hintText').hide();
        $('#page' + LevelSelector.getCurrentPage()).show();  
        $('.complete').hide();  
        $('#hintText').hide();           
    }
    
    function addLevelClicks(){
        var page,kid;        
        for(var i = 1; i < 3; i += 1){
        $('#tbody' + i).children().each(function(i, child){           
            kid =  $(child);           
            function Kid(e){
                e.preventDefault();
            }
            Kid.prototype.onRelease = function(e){
                if(e.isTap){
                    page = LevelSelector.getCurrentPage();
                    e.preventDefault();
                    if(page === 1){
                        goToPage(i + 3);
                    }
                    else{
                        goToPage(i + 13);
                    }
                    $('#circuit').show();
                    $('#hint').fadeTo('slow', '1');
                    $('#showLevels').fadeTo('slow', '1');
                    $('#prev').fadeTo('slow', '1');
                    $('#factory').show();     
                    Placer.place();
                    checkComplete();
                }
            }                                 
            multidrag.register(kid,Kid);
        });
      }
    }       
});	

function checkComplete(){
    var level = LevelSelector.getCurrentLevel();
    var page = LevelSelector.getCurrentPage();
    if(level.complete){            
        $('#row' + level.levelid).children('.checkmark').html('<img id = "check" src = "../levels/images/checkmark.png">');
        $('#page' + page).children('.complete').show();	        
    }
}
