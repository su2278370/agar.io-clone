var global = require('./global');
//static var speed = 1;

class Canvas {
    constructor(params) {
        this.directionLock = false;
        this.target = global.target;
        this.reenviar = true;
        this.socket = global.socket;
        this.directions = [];
        var self = this;


        this.cv = document.getElementById('cvs');
        this.cv.width = global.screenWidth;
        this.cv.height = global.screenHeight;
        this.cv.addEventListener('mousemove', this.gameInput, false);
        this.cv.addEventListener('mouseout', this.outOfBounds, false);
        this.cv.addEventListener('keypress', this.keyInput, false);
        this.cv.addEventListener('keyup', function(event) {
            self.reenviar = true;
            self.directionUp(event);
        }, false);
        this.cv.addEventListener('keydown', this.directionDown, false);
        this.cv.addEventListener('touchstart', this.touchInput, false);
        this.cv.addEventListener('touchmove', this.touchInput, false);
        this.cv.parent = self;
        global.canvas = this;

    }

    //var buttonX;
    //var buttonY;
    //static var speed = 1;

    getlogdata(button,value,speed){

        //var speed = 1;
    	
    	if(button=='X'){ //Left
            this.target.x = -2000;
    		this.target.y = 0;
            
    	}
    	else if(button=='Y'){ //Up
    		// this.target.x = 0;
    		// this.target.y = -200;
            if((speed+3)>12)
                speed = 12;
            else
                speed = speed+1;	
    	}

        else if(button=='A'){ //Down
            // this.target.x = 0;
            // this.target.y = 200;
            if((speed-1)<0)
                speed = 1;
            else
                speed = speed-1;   
            
        }

        else if(button=='B'){ //Right
            this.target.x = 500;
            this.target.y = 0;   
        }

        //---------------------//


        else if(button=='Horizontal'){ 

            if(value > 500){
                this.target.x = 500*speed;
                console.log("Down Max");
            }

            else if(value < 500 && value > 200  ){
                this.target.x = value*speed;
                console.log("Down");
            }

            else if(value < 200 && value > -200 ){
                this.target.x = 0;
                console.log("h0");
            }

            else if(value < -200 && value > -500){
                this.target.x = value*speed;
                console.log("Up");
            }

            else {
                this.target.x = -500*speed;
                console.log("Up Max");
            }
  
        }

        else if(button=='Vertical'){ 

            if(value > 500){
                this.target.y = 500*speed;
                console.log("Right Max");
            }

            else if(value < 500 && value > 200  ){
                this.target.y = value*speed;
                console.log("Right");
            }

            else if(value < 200 && value > -200 ){
                this.target.y = 0;
                console.log("v0");
            }

            else if(value < -200 && value > -500){
                this.target.y = value*speed;
                console.log("Left");
            }

            else {
                this.target.y = -500*speed;
                console.log("Left Max");   
            }
        }

        return speed;

        //--------------------//

        // else if(button=='Stick_B'){ 
        //     this.target.x = value;  
        // }

        // else if(button=='Stick_A'){ 
        //     this.target.y = value;   
        // }

        // else if(button=='Stick_X'){ 
        //     this.target.x = value;
        // }

        // else if(button=='Stick_Y'){ 
        //     this.target.y = value;   
        // }


	//buttonX = buttonupdown;

        //buttonY = buttonleftright;
    }

    // Function called when a key is pressed, will change direction if arrow key.
    directionDown(event) {
    	var key = event.which || event.keyCode;
        var self = this.parent; // have to do this so we are not using the cv object
    	if (self.directional(key)) {
    		self.directionLock = true;
    		if (self.newDirection(key, self.directions, true)) {
    			self.updateTarget(self.directions);
    			self.socket.emit('0', self.target);
    		}
    	}
    }

    // Function called when a key is lifted, will change direction if arrow key.
    directionUp(event) {
    	var key = event.which || event.keyCode;
    	if (this.directional(key)) { // this == the actual class
    		if (this.newDirection(key, this.directions, false)) {
    			this.updateTarget(this.directions);
    			if (this.directions.length === 0) this.directionLock = false;
    			this.socket.emit('0', this.target);
    		}
    	}
    }

    // Updates the direction array including information about the new direction.
    newDirection(direction, list, isAddition) {
    	var result = false;
    	var found = false;
    	for (var i = 0, len = list.length; i < len; i++) {
    		if (list[i] == direction) {
    			found = true;
    			if (!isAddition) {
    				result = true;
    				// Removes the direction.
    				list.splice(i, 1);
    			}
    			break;
    		}
    	}
    	// Adds the direction.
    	if (isAddition && found === false) {
    		result = true;
    		list.push(direction);
    	}

    	return result;
    }

    // Updates the target according to the directions in the directions array.
    updateTarget(list) {
    	this.target = { x : 0, y: 0 };
    	var directionHorizontal = 0;
    	var directionVertical = 0;
    	for (var i = 0, len = list.length; i < len; i++) {
    		if (directionHorizontal === 0) {
    			if (list[i] == global.KEY_LEFT) directionHorizontal -= Number.MAX_VALUE;
    			else if (list[i] == global.KEY_RIGHT) directionHorizontal += Number.MAX_VALUE;
    		}
    		if (directionVertical === 0) {
    			if (list[i] == global.KEY_UP) directionVertical -= Number.MAX_VALUE;
    			else if (list[i] == global.KEY_DOWN) directionVertical += Number.MAX_VALUE;
    		}
    	}
    	this.target.x = 500;//+= directionHorizontal;
    	this.target.y = 500;//+= directionVertical;
        global.target = this.target;
    }

    directional(key) {


    	return this.horizontal(key) || this.vertical(key);
    }

    horizontal(key) {

        //if(buttonleftright=='X')
           // return key == global.KEY_LEFT;
        //else if(buttonleftright=='Y')            
           // return key == global.KEY_RIGHT;
    	return key == global.KEY_LEFT || key == global.KEY_RIGHT;
    }

    vertical(key) {
	//if(buttonleftright=='A')
            //return key == global.KEY_UP;
        //else if(buttonleftright=='B')
            //return global.KEY_DOWN;        
    	return key == global.KEY_DOWN || key == global.KEY_UP;
    }

    // Register when the mouse goes off the canvas.
    outOfBounds() {
        if (!global.continuity) {
            this.parent.target = { x : 0, y: 0 };
            global.target = this.parent.target;
        }
    }

    gameInput(mouse) {
    	if (!this.directionLock) {
    		this.parent.target.x = mouse.clientX - this.width / 2;
    		this.parent.target.y = mouse.clientY - this.height / 2;
            global.target = this.parent.target;
    	}
    }

    touchInput(touch) {
        touch.preventDefault();
        touch.stopPropagation();
    	if (!this.directionLock) {
    		this.parent.target.x = touch.touches[0].clientX - this.width / 2;
    		this.parent.target.y = touch.touches[0].clientY - this.height / 2;
            global.target = this.parent.target;
    	}
    }

    // Chat command callback functions.
    keyInput(event) {
    	var key = event.which || event.keyCode;
    	if (key === global.KEY_FIREFOOD && this.parent.reenviar) {
            this.parent.socket.emit('1');
            this.parent.reenviar = false;
        }
        else if (key === global.KEY_SPLIT && this.parent.reenviar) {
            document.getElementById('split_cell').play();
            this.parent.socket.emit('2');
            this.parent.reenviar = false;
        }
        else if (key === global.KEY_CHAT) {
            document.getElementById('chatInput').focus();
        }
    }
}

module.exports = Canvas;
