var Credit = {};

(function(my, $){
	"use strict";
	var contentDiv = $('<div class = "page" id = "page23"></div>');
	my.slideDesc = function(){
		var body = $('#clipOrder');
		body.append(contentDiv);
		var header = $("<h2>Electra's Candy Factory</h2>");
		contentDiv.append(header);
		var myHeader = $('h2');
		myHeader.css('text-align', 'center');
		myHeader.css('font-size', '1.5em');
		myHeader.css('margin', '0px');
		myHeader.css('background-color', '#f5f3db');
		myHeader.css('padding', '0.3em 0 0.3em 0');
		contentDiv.css('text-align', 'center');
		var odysseyDesc = $('<div class = "credit">Odyssey Project Completed May 2012 at Hendrix College</div>'
						+ '<div><img src = "../levels/images/hendrix.png" id = "hlogo" height = "20%" width = "50%"></img></div>'
						+ '<div>Thanks for playing!!</div>');
						
		var circuitDiv = $('<div class = "credits"><table><tbody><tr><th><u>Circuit Editor</u></th></tr>'
							+ '<tr><td><b>Dr. Carl Burch</b></td></tr></tbody></table>');
							
		var clipboardDiv = $('<div class = "credits"><table><tbody><tr><th><u>Clipboard</u></th></tr>'
							+ '<tr><td><b>Concorde Habineza</b></td></tr><tr><td><b>Jeannette Inema</b></td></tr><tr><td><b>Brandon McNew</b></td></tr></tbody></table></div>');
							
		var factoryDiv = $('<div class = "credits"><table><tbody><tr><th><u>Factory Floor</u></th></tr>'
							+ '<tr><td><b>Thierry Kimenyi</b></td></tr><tr><td><b>Justin John</b></td></tr><tr><td><b>Sung Oh</b></td></tr></tbody></table></div>');
							
		var graphicDiv = $('<div class = "credits"><table><tbody><tr><th><u>Graphics Designer</u></th></tr>'
							+ '<tr><td><b>Megan Childress</b></td</tr></tbody></table</div>');
							
		var tutorialDiv = $('<div class = "credits"><table><tbody><tr><th><u>Tutorial/Credits</u></th></tr>'
							+ '<tr><td><b>Jeffrey Biles</b></td></tr><tr><td><b>Safari Sibomana</b></td></tr></tbody></table></div>');
		var myElts = [circuitDiv, clipboardDiv, factoryDiv, graphicDiv, tutorialDiv, odysseyDesc];
    	contentDiv.append(myElts[0]);
    	slideDivs(myElts, 0);	
    	contentDiv.css('overflow', 'hidden');			
		contentDiv.css('background-color', '#f5f3db');		
    }
	function slideDivs(divs, i){	
	    divs[i].css('width', '98%');
		divs[i].css('margin', '1%');
		divs[i].css('font-size', '1.5em');
		$('table th').css('padding-top', '1.5em');
		$('table td').css('font-size', '0.5em');
		$('table').css('margin-left', '15%');
		$('table').css('width', '70%');
		divs[i].css('margin-top', '0px');	
		if(i == divs.length -1){
	        return;
	    }	
		divs[i].delay(5000).animate({
			
		marginLeft: divs[i].outerWidth()
    		}, 2000, function(){
    			divs[i].remove();
    			if(i < divs.length -1){
    				contentDiv.append(divs[i + 1]);
    				slideDivs(divs, i+1);
    			}else{
    				contentDiv.html(divs[0]);
    				slideDivs(divs, 0);
    			}
    		});
		}

}(Credit, jQuery));
