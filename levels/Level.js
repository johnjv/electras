   function Level(){    	
    	this.levelid = 0;
    	this.levelname = "";
    	this.orderText = "";
    	this.hint = ""; 
    	this.sensors = "";
    	this.tools = [];
    	this.types = "";    	
    	this.script = "";
    	this.answers = "";
    	this.analysis = [];    	
   }
    	
  	Level.prototype.getMe = function(levelid){
  	    "use strict"; 	              
  	    var currentLevel = all_levels[levelid - 1];
  	    this.levelid = currentLevel.levelid;
    	this.levelname = currentLevel.levelname;
    	this.orderText = currentLevel.orderText;
    	this.hint = currentLevel.hint; 
    	this.sensors = currentLevel.sensors;
    	this.tools = currentLevel.tools;
    	this.types = currentLevel.types;    	
    	this.script = currentLevel.script;
    	this.answers = currentLevel.answers;    	
  	    currentLevel.analysis = this.analyze(); 
  	    this.analysis = currentLevel.analysis; 	    
  	    return currentLevel;
  	};
  	 
  	 
   	Level.prototype.analyze = function (){
   	   "use strict";
	   var analysis, levelSays, circuitSays, evaluator, sequence, i, sequenceItem ,j, levelAnswers, correct;	  
	   levelAnswers = this.parseAnswer(this.answers);   	   
	   sequence = this.getBest(this.types, levelAnswers);	   
	   analysis = []; 
	   correct = false;
	  
	   for(i = 0; i < sequence.length; i+=1){	               	        
	        for(j = 0; j < levelAnswers.length; j += 1){	                        
	            if(sequence[i] === levelAnswers[j]){	               	                              	                	                
	               correct = true;	 
	            }	            
	        }	              
	    levelSays = correct;
	    
	    // evaluator = new Circuit.getEvaluator();
	    circuitSays = {accept: true}; //evaluator.evaluate(sequence[i]);
	    sequenceItem = new SequenceItem(sequence[i], levelSays, circuitSays);	   
	    analysis.push(sequenceItem);
	    correct = false;
	   }	   
	   return analysis;
  	};
  	
  	Level.prototype.getLevelNames = function(){
  	    "use strict";
  	    var levels = [];
  	    var i;
  	    var level;
  	    for(i = 1; i <= all_levels.length; i += 1){
  	        level = this.getMe(i);
  	        levels.push(level);  	        
  	    }  	   
  	    return levels;
  	 };
   	
   	Level.prototype.getLevel = function(script){
   	    "use strict";
   	    var level;
   	    for(i = 1; i <= all_levels.length; i += 1){
  	        level = this.getMe(i);
  	        if(level.script === script){
  	            return level;
            }  	    
  	    }  	    
   		return "This script does not exist";
   	};
   	
    Level.prototype.getQuestion = function(level){
        "use strict";
   	    var question;
   	    var levelid = this.getMe(level);
   	    question = levelid.orderText;   	    
   		return question; 
   	};
   	
    Level.prototype.getSequence = function(types, answers){
	    sequenceLength = 8;
	    sequence = "";
	    var levelType = types;	    
	    if(types.length == 1){		    
	      	var type0 = types[0].toString();
	      	var count = type0.indexOf("C");	      	
	      	
	      	if( count !== -1){	  		
	      		var acceptabletypes = "C-,C|,Co";
	     		sequence = this.addToSeq(acceptabletypes);    		
	     	}
	      		
	      	else if(type0.indexOf("G") !== -1){
	      		var acceptabletypes = "G-,G|,Go";
	     		sequence = this.addToSeq(acceptabletypes); 		
	     	}
	     
	       	else if(type0.indexOf("Y")!== -1){
	        	var acceptabletypes = "Y-,Y|,Yo";
	        	sequence = this.addToSeq(acceptabletypes);     		
	      	}
	      		
	      	else if(type0.indexOf("R") !== -1){
	        	var acceptabletypes = "R-,R|,Ro";
	        	sequence = this.addToSeq(acceptabletypes);   		
	      	}
	      			  		
	      	else if(type0.indexOf("*") !== -1 && type0.indexOf("|") !==-1){
	      		var acceptabletypes = "G|,R|,Y|,C|";
	     		sequence = this.addToSeq(acceptabletypes); 		
	      	}
	      		
	      	else if(type0.indexOf("*") !== -1 && type0.indexOf("-") !==-1){
	      		var acceptabletypes = "G-,R-,Y-,C-";
	     		sequence = this.addToSeq(acceptabletypes);  		
	        	 
	      	}
	      	else if(type0.indexOf("*") !== -1 && type0.indexOf("o") !==-1){
	      		var acceptabletypes = "Go,Ro,Yo,Co";
	     		sequence = this.addToSeq(acceptabletypes); 	
	      	}
	      	
	      	else{	  		
	      		var acceptabletypes = "G-,G|,Go,R-,R|,Ro,Y-,Y|,Yo,C-,C|,Co";
	     		sequence = this.addToSeq(acceptabletypes); 	
	        }
	     }
	     return sequence;   
    };
    
      Level.prototype.parseAnswer = function(answer){
            var answers, newAnswers, i, j;
            answers = answer.split(",");
            newAnswers =[];            
            
            for(i = 0;i< answers.length; i += 1 ){
                if($.trim(answers[i].split("")[0]) === '*'){
                    newAnswers.push( 'G' + $.trim(answers[i].split("")[1]) );
                    newAnswers.push( 'Y' + $.trim(answers[i].split("")[1]) );
                    newAnswers.push( 'R' + $.trim(answers[i].split("")[1]) );
                    newAnswers.push( 'C' + $.trim(answers[i].split("")[1]) );
                }
                else if($.trim(answers[i].split("")[1]) === '*'){
                        newAnswers.push( $.trim(answers[i].split("")[0]) + '-' );
                        newAnswers.push( $.trim(answers[i].split("")[0]) + 'o' );
                        newAnswers.push( $.trim(answers[i].split("")[0]) + '|' );
                }
                else{
                    newAnswers.push(answers[i]);
                }                  
            }                                    
            for (i = 0; i < newAnswers.length; i += 1){
                for (j= 1+i; j < newAnswers.length; j += 1) {
                    if(newAnswers[i]=== newAnswers[j]){
                        newAnswers.splice(i,1)          
                    }            
                }
            }
            return newAnswers;            
    };
    
    Level.prototype.getBest = function(types, answers){
       var sequence, i, bestCase, j , k, maxSeq, total, arraySeq;       
       maxSeq = 0;
       bestCase = 0;
       arraySeq = [];
       for(i = 0; i <= 200; i += 1){           
            sequence = this.getSequence(types, answers);	   
	        sequence = sequence.split(',');
	        arraySeq.push(sequence);
	        for(j = 0; j < sequence.length; j +=1){
	            total = 0; 
	            for(k = 0; k < answers.length; k += 1){
	                if(sequence[j] === answers[k]){
	                    total += 1;
	                }               
	           }
	           if(total > maxSeq){
	                maxSeq = total;
	                bestCase = i;	        
	           }
	       }
	  }
	    return arraySeq[bestCase];
    };
    
    Level.prototype.addToSeq = function(types){        
        var sequence = "";
        var acceptableelementType = types.split(",");
 	 	for(i = 0; i < 8;i++){
   			var index = Math.floor(Math.random()*acceptableelementType.length);
   			sequence += acceptableelementType[index] ;
   			if(i != 7){
   			    sequence += ",";
   			}
        }        
        return sequence;    
    };
