var Credit = {};

(function(my, $){
	"use strict";
	var contentDiv = $('<div class = "page" id = "page23"></div>');
	my.slideDesc = function(){
		var body = $('#clipOrder');
		body.append(contentDiv); 
		
		var odysseyDesc = $('<h2><div>Odyssey Project Completed May 2012 at Hendrix College</div>'
						+ '<div><img src = "hendrix.png"></img></div>');
						
		var circuitDiv = $('<div class = "credits"><table><tbody><tr><th>Circuit Editor</th></tr>'
							+ '<tr><td>Dr. Carl Burch</td></tr></tbody></table>');
							
		var clipboardDiv = $('<div class = "credits"><table><tbody><tr><th>Clipboard</th></tr>'
							+ '<tr><td>Concorde Habineza</td><tr><td>Jeannette Inema</td></tr><tr><td>Brandon McNew</td></tr></tbody></table></div>');
							
		var factoryDiv = $('<div class = "credits"><table><tbody><tr><th>Factory Floor</th></tr>'
							+ '<tr><td>Thierry Kimenyi</td></tr><tr><td>Justin John</td></tr><tr><td>Sung Oh</td></tr></tbody></table></div>');
							
		var graphicDiv = $('<div class = "credits"><table><tbody><tr><th>Graphics Designer</th></tr>'
							+ '<tr><td>Megan Childress</td</tr></tbody></table</div>');
							
		var tutorialDiv = $('<div class = "credits"><table><tbody><tr><th>Tutorial/Credit</th></tr>'
							+ '<tr><td>Jeffrey Biles</td></tr><tr><td>Safari Sibomana</td></tr><tr><td>Pierre Urisanga</td></tr></tbody></table></div>');
		var myElts = [odysseyDesc, circuitDiv, clipboardDiv, factoryDiv, graphicDiv, tutorialDiv];
    	contentDiv.html(myElts[0]);
    	slideDivs(myElts, 0);
		}
	function slideDivs(divs, i){		
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
