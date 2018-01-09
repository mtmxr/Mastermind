//global variables
var answer = [0,0], guess = []; //guess code & answer obtained from codemaker (from html)
var allPossibleCodes = [], strategicGuesses = []; // support containers for data manipulation
var elemID; // html element ID

/* main function called from the HTML on button click */
function mainFunct (event) {


	elemID = parseInt(event.target.id);
	if (elemID == 0) //element ID=0 indicates we are starting the game, each subsequent run will be ID of non 0
	{

		// generate array of all possible codes - 1296 possibilities of 4 out of 6 possible digits with repetitions allowed
		allPossibleCodes = initArray (); 
		//printArray(allPossibleCodes, "debug"); //debug

	}
	else { 
		//read and evaluate the answer from previous plate index
		getUserAnswer(elemID);
        //console.log("getUserAnswer result: ", answer); //debug
        var exit_code = evalAnswer(); //returns null if answer is [4,4] indicating all colors and positions are correct (all WHITE pegs in answer plate)
        if (!exit_code) {
            alert("You indicated I found the code :)."); 
            return;
        }

	}
    generateGuess(); //generates random guess from allPossibleCodes
    printGuess(elemID); //prints pegs into the html elements
	elemID++; //update SUBMIT button ID for html output
	printSubmit (elemID); // reprint SUBMIT button with non-zero ID (also counts number of turns)
	
}


//this function sets the variables needed to create permutations of all possible 4-digit codes out of 6 possibilities
function initArray () {
	var possibilities = [ 1,2,3,4,5,6 ]; // set of possibilities to permute through
	var n = 4; // code length
	var code = []; // initial code


	// init first permutation 
	for (var i=0; i<4 ; i++ )
	{
		code[i] = possibilities[0];
	}

	// get all permutations (with repetition) from set of 'possibilities'
	var permutations = getPermutations (code, possibilities);
	return permutations;
}



// this function uses recursion to generate permutations (codes) with repetition of elements from set of given possibilities
function getPermutations(code, possibilities){

	var n = code.length, // n=4 in our case
	permutations = [], // this will be the array of codes to be returned
	spliceElem = [], // used to append to recursively permuted array
	spliceArr = [], // this is the array used in recursion
	restPerms = [], // value returned from recursion , i.e permuted array
	pushElem = []; // this is the code returned from recursive permute that will be pushed to permutations, used in recursion as well

	// we will stop recursion when there is nothing more to permute
	if (n <= 1)
	{
		return possibilities; // could hard code this as return [1,2,3,4,5,6] so as to not recursively pass it, but then logic suffers
	}


	// copy argument array as so not to change it
	spliceArr = code;
	
	// we are always removing the first element and producing a shorter array to permute
	spliceElem = spliceArr.splice(0, 1);

	//actual recursion
	restPerms = getPermutations(spliceArr, possibilities);

	// once we reach a point when there is nothing to permute, i.e. array length = 1, then we combine results to generate the code
	for (var x=0; x<possibilities.length; x++)
	{
		for (var y = 0; y<restPerms.length; y++)
		{
			pushElem = spliceElem.concat(restPerms[y]);
			permutations.push(pushElem);
		}
		spliceElem[0]++;
	}
	return permutations; // returns the permutation list
}

// function that prints arrays for HTML document
function printArray(myArray, divname){
	var output = "<br>";
	for(i=0;i<myArray.length;i++)
	{
		output = output + myArray[i] + "<br>";
	}
	document.getElementById(divname).innerHTML = output;
}

//this function simulates minimax to generate the next guess 
function generateGuess() {
    
    
    console.log("allPossibleCodes.length in generateGuess: ", allPossibleCodes.length);

	//make sure we have more elements
	if (allPossibleCodes.length == 0)
	{
		alert("ERROR: allPossibleCodes empty");
	}

	//generate strategic guesses in a cheating minimax manner
	strategicGuesses = createStrategyGuesses (allPossibleCodes, 2);
		
	if (strategicGuesses.length < 10) // LOWERED THIS FROM 20
	{
		var grab = Math.ceil(Math.random()*3);
		strategicGuesses = createStrategyGuesses (allPossibleCodes, grab);
	
	}
	if (strategicGuesses.length == 0)
	{
		strategicGuesses=allPossibleCodes;

	}

	//select a random strategic guess, then display it with input boxes for user feedback
	var guess_arr = strategicGuesses.splice(Math.floor(Math.random()*strategicGuesses.length), 1);
	guess = guess_arr[0];
    console.log("my guess is : ", guess, "of type: ", typeof guess);
	console.log ("guess: " + guess);
 

}

// function to generate a set of guesses based on the number of unique elements in a code 
function createStrategyGuesses (allPossibleCodes, grab) {
	var guesses = [];
	for (var i=0; i<allPossibleCodes.length ; i++ )
	{
		var temp = allPossibleCodes[i];

		// first extract unique elements of guess
		var unique=temp.filter(function(itm,i,temp){
		return i==temp.indexOf(itm);
		});

		if (unique.length == grab)
		{
			guesses.push(allPossibleCodes[i]);
		}
			
	}

	return guesses;
}

// function to print next guess to HTML - this will be replaced with better GUI eventually
function printGuess (turn) {
	var pin="";
	var j=0;

	//for each guess generate colored pin
	for (var i=0 ; i<guess.length ; i++ )
	{
		switch (guess[i])
		{
		case 1:
			//BLUE
			pin = "./images/BLUE.gif";			
		break;
		case 2:
			//GREEN
			pin = "./images/GREEN.gif";			
		break;
		case 3:
			//ORANGE
			pin = "./images/ORANGE.gif";			
		break;
		case 4:
			//PURPLE
			pin = "./images/PURPLE.gif";			
		break;
		case 5:
			//RED
			pin = "./images/RED.gif";			
		break;
		case 6:
			//YELLOW
			pin = "./images/YELLOW.gif";			
		break;
		default:
			alert("ERROR: I do not accept color codes other than 1,2,3,4,5,6")
		
		}

		var code_pin_holder_id = "code_pin_holder_";
		code_pin_holder_id = code_pin_holder_id.concat(turn, j);
		var pnd="#";
		code_pin_holder_id = pnd.concat(code_pin_holder_id);
		j++;

		var output="<img src=\"";
		output+=pin;
		output+="\" class=\"pin\">";
		jQuery(code_pin_holder_id).html(output);
	
		

		console.log("#code_pin_holder_id: " + code_pin_holder_id);
		console.log("getUserAnswer " + pin);


	}
}

//function to print the next SUBMIT button - this counts turns by updating html element ID
function printSubmit(submitID) {
	var output="<button onclick=\"mainFunct(event, this.id)\" id=\"" + submitID + "\">SUBMIT ANSWER</button>";
	jQuery("#submit").html(output);
}

//this function displays a WHITE peg on left mouse click, BLACK peg on right mouse click
//and clears the peg if user clicks the middle mouse button
function handleClickAnswer (evt, tgtid) {
	var elemID = tgtid;


	if (elemID == "")
	{
		console.log("ERROR, element ID blank");
		alert("ERROR!!! - element ID blank!!!");
	}


	var imgID = "aimage_";
	console.log("tgtid[tgtid.length-2]: " + tgtid[tgtid.length-2] + ", tgtid[tgtid.length-1]: " + tgtid[tgtid.length-1]);
	imgID = imgID.concat(tgtid[tgtid.length-2] ,tgtid[tgtid.length-1]);

	console.log("Element ID: " + elemID);
	console.log("New image ID: " + imgID);
	
	var clickType = "LEFT";
	if (evt.type!="mousedown") return true;
	if (evt.which) {
		if (evt.which==3) clickType = "RIGHT";
		if (evt.which==2) clickType = "MIDDLE";
	}
	else if (evt.button) {
		if (evt.which==2) clickType = "RIGHT";
		if (evt.which==4) clickType = "MIDDLE";

	}
	console.log(evt.type + ": " + clickType + " mouse button!");
	console.log("Element ID: " + elemID);

	//concat '#' in front of imgID
	var pnd = "#";
	imgID = pnd.concat(imgID);


	switch (clickType)
	{
	case "RIGHT" :
		//right click = black = color correct position incorrect

		jQuery(imgID).attr("src","./images/BLACK.gif" );
		break;
	case "LEFT" :
		//left click = white = color correct position correct
		jQuery(imgID).attr("src","./images/WHITE.gif" );
		break;
	case "MIDDLE" :
		//middle click = empty = remove pin
		jQuery(imgID).attr("src","./images/EMPTY.gif" );
		break;
	default : 
		alert("I do not understand, I only understand LEFT, RIGHT or MIDDLE mouse click");
	
	}
	
}

// function to retreive user feedback and remove any elements that don't match from allPossibleCodes
function getUserAnswer(answer_plate_index)
{
	var imgID;
	var colors=0 , positions =0;
	//curent code index plate was updated, we are evaluating the plate from previous index
	answer_plate_index--;
	for (var i=0;i<4 ;i++ )
	{
		imgID="#aimage_";
		imgID=imgID.concat(answer_plate_index, i);
		console.log("getting answer from #answer_pin_holder_ID: " + imgID);
		var $img = $(imgID);
		var src = $img.attr("src");
		if (src=="./images/WHITE.gif")
		{
			positions++;
			colors++;
		}
		else if (src=="./images/BLACK.gif")
		{
			colors++;
		}
		else if (src=="./images/EMPTY.gif")
		{
			//otherwise don't update colors or positions
		}
		else
		{
			alert("ERROR: I cant only have WHITE, BLACK, or EMPTY answer pin");
		}

	}
	answer = [colors, positions];


}

//since guess is not the initial value of [0,0,0,0], it must have been changed
//this means we interacted with the User and we should have user feedback
//note guess can never be [0,0,0,0] except for the first time through this function or some unexpected ERROR
//we evaluate the answer and proceed to weed out possible codes until we get answer of [4,4] (all positions and colors are correct at answer[4,4]
function evalAnswer(){

	var colors=parseInt(answer[0]); 
	var positions=parseInt(answer[1]);
	var positions_correct, colors_correct;


	if (positions == 4 && colors == 4)
	{
		
        //console.log("answer 4,4, exit: ", answer);
        //alert ("check log");
        return 0; //we're done
	}
	
	else
	{
			
		// then we filter according to answer
		// first extract unique elements of guess
        console.log("guess is: ", guess);
		var unique=guess.filter(function(itm,i,guess){
		return i==guess.indexOf(itm);
		});
        
        //console.log("unique elements of guess are: ", unique);
        //alert("check log");

		//remove any codes that do not match color count
		var i = allPossibleCodes.length - 1;
		while (allPossibleCodes[i])
		{

			colors_correct = 0 ; // determines probable answer based on number of colors
			positions_correct = 0; // determines probable answer based on number of positions

			//determine colors_correct
			switch (colors)
			{
			case 0:
				for (var j = 0; j<unique.length ;j++ )
				{
					colors_correct += elementCount (unique[j], allPossibleCodes[i]);
				}
				if (colors_correct > 0)
				{
					//set the variables to remove the code
					colors_correct = 1;
					positions_correct = 2;
					
				}
			break;
				
			case 1: 
				for (var j = 0; j<unique.length ;j++ )
				{
					colors_correct += elementCount (unique[j], allPossibleCodes[i]);
				}
				if (colors_correct > colors)
				{
					//we have to keep this code
					colors_correct = colors;
					
				}
			break;

			case 2: 
				var uniq_count = [];
				// see how many times each unique element of 'guess' appears in 'code'
				for (var j = 0; j<unique.length ;j++ )
				{
					uniq_count[j] = elementCount (unique[j], allPossibleCodes[i]);

				}
				// make copy as not to modify through reference
				// we will splice each element of the copy and compare it to each element in original
				uniq_count_cpy = Object.create(uniq_count);
				var pop_count;
				// do some magic to determine if 'code' should stay or go
				while (uniq_count_cpy.length != 0)
				{
					pop_count = uniq_count_cpy.splice(0,1);
					if (pop_count[0] >= colors)
					{
						//keep this code
						colors_correct = colors;
						break;
					}
					for (var k=0;k<uniq_count.length ;k++ )
					{
						var uniq_count_k = uniq_count[k];
						if (pop_count[0] + uniq_count[k] == colors)
						{
							colors_correct = colors;
							break;

						}
					}
				}



			break;

			case 3:
				var uniq_count = [];
				// see how many times each unique element of 'guess' appears in 'code'
				for (var j = 0; j<unique.length ;j++ )
				{
					uniq_count[j] = elementCount (unique[j], allPossibleCodes[i]);

				}
				// make copy as not to modify through reference
				// we will splice each element of the copy and compare it to each element in original
				uniq_count_cpy = Object.create(uniq_count);
				var pop_count;
				// do some magic to determine if 'code' should stay or go
				while (uniq_count_cpy.length != 0)
				{
					pop_count = uniq_count_cpy.splice(0,1);
					if (pop_count[0] >= colors)
					{
						//keep this code
						colors_correct = colors;
						break;
					}
					for (var k=0;k<uniq_count.length ;k++ )
					{
						var uniq_count_k = uniq_count[k];
						if (pop_count[0] + uniq_count[k] == colors)
						{
							colors_correct = colors;
							break;

						}
					}
				}



			break;


			case 4: 
				//check positions only
				colors_correct = 4;
			break;

			
			}

			// check for acceptable number of positions
			positions_correct += comparePositions(guess, allPossibleCodes[i]);

			//in the following code we determine base on previous analysis if the code stays or goes
			if ((colors_correct != colors || positions_correct != positions) && colors_correct != 0)
			{
				// this line removes codes without potentioal
				var foobar = allPossibleCodes.splice(i,1);
		
			}
			i--;

            
		}

	return 1;
   

	}


}

//function takes array and a single element
// then counts the number of times element occurs in the array
function elementCount (elem, arr) {
	var count = 0;

	for (var i = 0; i < arr.length; i++ )
	{
		//console.log ("arr: " + arr + ", count: " + count + ", elem: " + elem);

		if (elem == arr[i])
		{
			
			count++;
			
		}
	}
	return count;

}

function comparePositions(arr1, arr2) {
	var count = 0;

	for (var i = 0; i < arr1.length; i++ )
	{
		//console.log ("arr: " + arr + ", count: " + count + ", elem: " + elem);

		if (arr1[i] == arr2[i])
		{
			
			count++;
			
		}
	}
	return count;
}


