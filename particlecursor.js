/*
                                                                                                      
,------.                  ,--.  ,--.      ,--.            ,-----.                                     
|  .--. ' ,--,--.,--.--.,-'  '-.`--' ,---.|  | ,---.     '  .--./,--.,--.,--.--. ,---.  ,---. ,--.--. 
|  '--' |' ,-.  ||  .--''-.  .-',--.| .--'|  || .-. :    |  |    |  ||  ||  .--'(  .-' | .-. ||  .--' 
|  | --' \ '-'  ||  |     |  |  |  |\ `--.|  |\   --.    '  '--'\'  ''  '|  |   .-'  `)' '-' '|  |    
`--'      `--`--'`--'     `--'  `--' `---'`--' `----'     `-----' `----' `--'   `----'  `---' `--'    

a cute particle effect for your mouse!
by @alienmelon
*/

//array of images used for the burn sprites (can have multiple types of images)
var arr_particlecursor_imgMood01 = ["IMG_HEART_02.gif", "IMG_HEART_01.gif"];
var arr_particlecursor_imgMood02 = ["IMG_HAPPY_01.gif", "IMG_HAPPY_02.gif", "IMG_HAPPY_03.gif", "IMG_HAPPY_04.gif", "IMG_HAPPY_05.gif"];
var arr_particlecursor_imgMood03 = ["IMG_BADMOOD_03.gif", "IMG_BADMOOD_01.gif", "IMG_BADMOOD_02.gif"];

var arr_particlecursor_particles = [];//all particles are pushed to this. for managing clearning.

//the currently selected image array
//to change what images display (example: on rollover of certain elements)
//change this to set the cursor "mood"
var curr_particlecursor_imageArr = arr_particlecursor_imgMood01;

//paths & types
var str_particlecursor_path = "particlecursor_images/";
var str_particlecursor_type = "flame";

//mouse coordinates
var num_particlecursor_xPos = 0;
var num_particlecursor_yPos = 0;
//amounts
var num_particlecursor_amnt = 10;//amount of burning particles
var bool_isBurning = true;//if the burning has started or stopped (pause burning)
var bool_clear_particlecursor = false;//set this to true to completely clear (ends and removes all)

//returns the mouse coordinates (for sprite placement)
function particlecursor_getMouseCoords(event){
	//console.log("mouse location:", event.clientX, event.clientY);
	num_particlecursor_xPos = event.clientX;
	num_particlecursor_yPos = event.clientY;
}

//returns a random number range (min and max)
function particlecursor_randRange(num_min, num_max){
	return (Math.random() * (num_max - num_min + 1)) + num_min;
}

function particlecursor_removeParticle(img){
	var _this = img;
	if(_this != null){
		_this.parentNode.removeChild(_this);
	};
}

//make a particle div with an image
function particlecursor_makeParticle(num){
	var img = document.createElement('img');
	//get a random image from the array
	var img_src = str_particlecursor_path + curr_particlecursor_imageArr[Math.ceil(Math.random()*curr_particlecursor_imageArr.length)-1];
	img.src = img_src;
	//add styles (should not be clickable, etc...)
	img.class = "particlecursor";
	img.id = "_mparticle_"+String(num);
	img.style.position = "fixed";
	img.style.pointerEvents = "none";
	//interval id
	var intId = String("int_" + img.id);
	//place
	img.style.left = String(num_particlecursor_xPos) + "px";
	img.style.top = String(num_particlecursor_yPos) + "px";
	img.style.alpha = String(particlecursor_randRange(0.1, 1));
	//
	var num_yVariation = particlecursor_randRange(-num, 0);
	var num_xVariation = particlecursor_randRange(-2, 2);
	//
	if(str_particlecursor_type == "flame"){
		num_yVariation = particlecursor_randRange(-num, 0);
		num_xVariation = particlecursor_randRange(-2, 2);
	}
	if(str_particlecursor_type == "wisp"){
		num_yVariation = particlecursor_randRange(-3, 3);
		num_xVariation = particlecursor_randRange(-3, 3);
	}
	//
	arr_particlecursor_particles.push(img);
	document.getElementsByTagName("body")[0].appendChild(img);
	//init
	window[intId] = setInterval(particlecursor_move, 50, img, intId, num, num_xVariation, num_yVariation);
	/*
	note: i realize the mistake i made here where you should ideally NOT initiate so many intervals (for performance)
	but this is how it turned out. it's not that big of a deal if you don't spawn more than 20
	and i'll fix this eventually... for now this is good enough
	*/
}

function particlecursor_makeParticles(){
	for(var i = 0; i<num_particlecursor_amnt; ++i){
		particlecursor_makeParticle(i);
	}
}

function particlecursor_clearParticles(){
	for(var i = 0; i<arr_particlecursor_particles.length; ++i){
		var intId = String("int_" + arr_particlecursor_particles[i].id);
		clearInterval(window[intId]);
		particlecursor_removeParticle(arr_particlecursor_particles[i]);
	}
	arr_particlecursor_particles = [];
}

//animation (start interval)
function particlecursor_move(imgElement, intId, num, num_variationX, num_variationY){
	//get values
	var num_particle_x = parseInt(imgElement.style.left) + num_variationX;
	var num_particle_y = parseInt(imgElement.style.top) + num_variationY;
	var num_particle_opacity = window.getComputedStyle(imgElement).getPropertyValue("opacity");
	//set
	num_particle_opacity -= 0.1;
	num_particle_y -= 1;
	//if you stopped it, fade out and then remove 
	if(bool_clear_particlecursor && num_particle_opacity <= 0){
		//if it stopped, remove once faded out
		clearInterval(window[intId]);
		particlecursor_removeParticle(imgElement);
	}
	//if opacity is gone, reset and move again
	if(num_particle_opacity <= 0 && bool_isBurning){
		num_particle_x = num_particlecursor_xPos + num_variationX;
		num_particle_y = num_particlecursor_yPos + num_variationY;
		num_particle_opacity = particlecursor_randRange(0.1, 1);
		//set to image here
		imgElement.src = str_particlecursor_path + curr_particlecursor_imageArr[Math.ceil(Math.random()*curr_particlecursor_imageArr.length)-1];
		//I AM HERE, SETTING IMAGE TYPES ACORDING TO CURRENT IMAGE ARRAY
		//TOGGLE CURRENT IMAGE ARRAY
	}
	//apply values now
	imgElement.style.left = String(num_particle_x) + "px";
	imgElement.style.top = String(num_particle_y) + "px";
	imgElement.style.opacity = String(num_particle_opacity);
	//
}

//stop burning (ends animations and lets sprites be removed)
//each sprite removes itselfs once it fully fades out
function stop_particlecursor(){
	bool_isBurning = false;
}
//call this to start the burning again, if you have stopped it
function start_particlecursor(){
	bool_isBurning = true;
}

//remove all fire -- call this to completely clear all
//particlecursor needs to be called again to start it again
function clear_particlecursor(){
	bool_clear_particlecursor = true;
}

//set the mood (1, 2, or 3)
function set_particlecursorMood(num){
	if(num == 1){
		curr_particlecursor_imageArr = arr_particlecursor_imgMood01;
	}else if(num == 2){
		curr_particlecursor_imageArr = arr_particlecursor_imgMood02;
	}else if(num == 3){
		curr_particlecursor_imageArr = arr_particlecursor_imgMood03;
	}else{
		//else a default
		curr_particlecursor_imageArr = arr_particlecursor_imgMood01;
	}
}

//change the type of burn
//between "flame" (normal) and "wisp" (calm outward burn)
function change_particlecursorType(str_type){
	//end all
	particlecursor_clearParticles();
	//start over
	str_particlecursor_type = str_type;
	particlecursor_makeParticles();
}

//small test function to change the mood on click (optional)
//comment this out from particlecursor if you don't want it
function event_particlecursorMood(){
	set_particlecursorMood(Math.ceil(particlecursor_randRange(0, 2)));
}

//makes the particles on mouse enter
//necessary for getting the coordinates for the first time
function event_particlecursor_mouseEnter(event){
	//remove trigger
	particlecursor_getMouseCoords(event);
	document.getElementsByTagName("body")[0].onmouseenter = null;
	particlecursor_makeParticles();
}

//call particlecursor() to init (on page load...)
//
//NOTES:
//10-20 is the recommended amount. too many may cause preformance issues.
//"flame" = normal fire type
//"wisp" = calm bundle of flames that project outward all around the cursor
//
//if you've already called this and want it to stop OR start again
//then call stop_particlecursor() and start_particlecursor()
function particlecursor(num_amount, str_type){
	//stop from too high an amount being set
	if(num_amount > 25){
		num_amount = 25;
	}
	//setup
	str_particlecursor_type = str_type;
	num_particlecursor_amnt = num_amount;
	bool_isBurning = true;
	//start events
	document.onmousemove = particlecursor_getMouseCoords;
	//populate (populates as part of an enter event so that coords get passed)
	document.getElementsByTagName("body")[0].onmouseenter = event_particlecursor_mouseEnter;
	//clicking on the page changes the cursor mood by default (if you don't want this, comment it out)
	document.onmousedown = event_particlecursorMood;
}

//alternatively from the above (run a mobile device check for desktop only)...
//comment in, and call this instead (on page load)...
//call this to run a mobile check first
//if it's mobile, then don't run
//check if a mobile browser
/*function particlecursor_mobilecheck(){
	//http://detectmobilebrowsers.com/
	var check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|android|ipad|playbook|silk|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
}
function particlecursor_mobile(num_amount, str_type){
	//mobile browser check because of sound handling - see fp_setFrogAnimation
	if(!particlecursor_mobilecheck()){
		particlecursor(num_amount, str_type);
	}else{
		//do nothing
	}
}*/