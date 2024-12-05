import { hsvObjectToRgbString, getColorFromGradient } from "../colorFunctions/colorFunctions";

class Snake { 

    constructor({ canvasRef, parameters }) {
        this.canvasRef = canvasRef;

        this.parameters = parameters;
        this.status = {
            isRunning: false,
            intervalId: null,
            location: {x: 200, y: 200},

            Color: {
                ForegroundColor: {
                    pos: 0,
                    dir: 1,
                }
            },
            Shape: {
                ElementSize: {
                    pos: 0, 
                    dir: 1,
                }
            }

        };


        
    }


    setParameters(parameters) { 
        
        if (this.status.isRunning) { 
            this.stop();
            this.parameters = parameters;
            const speed = (100 - this.parameters.Movement.Speed);
            const interval = this.nonLinearScale(speed, 4, 3000);
            this.start(interval);
        }
        else { 
            this.parameters = parameters;
        }
    }

    nonLinearScale(input, outputMin, outputMax) {

        const normalizedInput = input / 100; // maps input to [0, 1]
        const scaledValue = outputMin * Math.pow((outputMax/outputMin), normalizedInput);

        return scaledValue;
    }



    handleDynamicRangeMove({ speed, shiftType, pos, dir }) { 

        const shiftSpeed = parseInt(speed);
        let colorStep = this.nonLinearScale(shiftSpeed, 0.001, 99);

        let newPos = pos;
        let newDir = dir;


        if (shiftType == "loop") { 
            newPos = (pos + colorStep) % 100;
        }
        else if (shiftType == "bounce") { 
            
            newPos = pos + colorStep * dir;
            if (newPos > 100) { 
                // needs to turn negative
                newDir = -1;
                newPos = pos + colorStep * newDir;
            }
            else if (newPos < 0) { 
                // needs to turn postive
                newDir = 1;
                newPos = pos + colorStep * newDir;
            }

        }
        else if (shiftType == "meander"){ 
            newDir = Math.random() > 0.5 ? 1 : -1; // maybe increase, maybe decrease
            newPos = (pos + newDir * colorStep) % 100;

            if (newPos > 100) { 
                newPos -= 100;
            }
            else if (newPos < 0) {
                newPos += 100;
            }


        }
        else if (shiftType == "random") { 
            newPos = Math.random() * 100;
        }


        return { pos: newPos, dir: newDir };
    }

    callDynamicRangeMove(category, target) { 
        if (!this.parameters[category][target].isStatic) { 


            ({ pos: this.status[category][target].pos, dir: this.status[category][target].dir }  = this.handleDynamicRangeMove(
                {
                    speed: this.parameters[category][target].ShiftSpeed || 1,
                    shiftType: this.parameters[category][target].ShiftType || "loop",
                    pos: this.status[category][target].pos || 0,
                    dir: this.status[category][target].dir || 1
                }
           ));
    
        }
    }


    move() { 

        const stepSize = this.parameters.Movement.StepSize;
        const elementSize = this.parameters.Shape.ElementSize.Static;
        const borderSize = this.parameters.Shape.BorderSize.Static;


        const angle = Math.random() * 2 * Math.PI;


        const dx = stepSize * Math.cos(angle);
        const dy = stepSize * Math.sin(angle);

        const leftBound = 0;
        const rightBound = this.canvasRef.current.width - elementSize - borderSize;
        const bottomBound = 0;
        const topBound = this.canvasRef.current.height - elementSize - borderSize;
        

        if (dx + this.status.location.x > leftBound && dx + this.status.location.x < rightBound) { 
            this.status.location.x += dx;
        }
        if (dy + this.status.location.y > bottomBound && dy + this.status.location.y < topBound) { 
            this.status.location.y += dy;
        }

        // move the dynamic range elements
        this.callDynamicRangeMove("Color", "ForegroundColor");

        
    
    }

    getStaticOrDynamicColor(category, target) { 
        
        if (this.parameters[category][target].isStatic) { 
            return hsvObjectToRgbString(this.parameters[category][target].Static);
        }
        else {
            return getColorFromGradient(this.parameters[category][target].Dynamic, this.status[category][target].pos);
        }

    }

    getStaticOrDynamicLinear() { 

       
    }


    draw() { 




        let elementSize;



        let foregroundColor = this.getStaticOrDynamicColor("Color", "ForegroundColor");


        if (this.parameters.Shape.ElementSize.isStatic) { 
            elementSize = this.parameters.Shape.ElementSize.Static;
            // console.log("Element size (static): ", elementSize);
        }
        else {
            // TODO, fix this
            // console.log("All the keys parameters has: ", Object.keys(this.parameters.Shape.ElementSize));
            const lowerBound = Math.min(...this.parameters.Shape.ElementSize.Dynamic);
            const upperBound = Math.max(...this.parameters.Shape.ElementSize.Dynamic);
        

            const diff = upperBound - lowerBound;
            const distance = diff * (this.status.elementSizePos / 100); 


            elementSize = lowerBound + distance;
        }




        const borderColor = hsvObjectToRgbString(this.parameters.Color.BorderColor.Static);
    
        const borderSize = this.parameters.Shape.BorderSize.Static;
  

        const location = this.status.location;


        

        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext("2d");


        // console.log("borderColor: ", borderColor);
        // console.log("location: ", location);
        // console.log("elementSize: ", elementSize);
        // console.log("borderSize: ", borderSize);

        
        ctx.fillStyle = borderColor;
        ctx.fillRect(location.x, location.y, elementSize  + 2*borderSize, elementSize + 2*borderSize);

        ctx.fillStyle = foregroundColor;
        ctx.fillRect(location.x + borderSize, location.y + borderSize, elementSize, elementSize);


        // console.log("Draw should occur");

    }

    start(interval) { 
        this.intervalId = setInterval(() => { 
            this.move();
            this.draw();
        }, interval);
        this.status.isRunning = true;
    }

    stop() { 
        clearInterval(this.intervalId);
        this.status.isRunning = false;
    }

    run() { 
        if (this.status.isRunning) { 
            this.stop();
        }
        else { 
            const speed = (100 - this.parameters.Movement.Speed);
            const interval = this.nonLinearScale(speed, 4, 3000);
            this.start(interval);
        }
    }






}

export default Snake;