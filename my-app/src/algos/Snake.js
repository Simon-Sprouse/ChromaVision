import { hsvObjectToRgbString, getColorFromGradient } from "../colorFunctions/colorFunctions";
import { getSquareCoordinates } from "../geometry/geometry";

class Snake { 

    constructor({ canvasRef, parameters }) {
        this.canvasRef = canvasRef;

        this.parameters = parameters;
        this.status = {


            Color: {
                ForegroundColor: {
                    pos: 0,
                    dir: 1,
                },
                BorderColor: {
                    pos: 0,
                    dir: 1
                }
            },
            Shape: {
                ElementTilt: {
                    pos: 0, 
                    dir: 1
                },
                ElementSize: {
                    pos: 0, 
                    dir: 1,
                },
                BorderSize: {
                    pos: 0, 
                    dir: 1
                },
            },
            Movement: {
                isRunning: false,
                intervalId: null,
                location: {x: 200, y: 200},
            }

        };


        
    }


    setParameters(parameters) { 
        
        if (this.status.Movement.isRunning) { 
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

    moveLocation() { 


        const leftBound = 0;
        const rightBound = this.canvasRef.current.width;
        const bottomBound = 0;
        const topBound = this.canvasRef.current.height;

        const pattern = this.parameters.Movement.Pattern;

        if (pattern == "randomWalk") { 

            const stepSize = this.parameters.Movement.StepSize;
            
            const angle = Math.random() * 2 * Math.PI;


            const dx = stepSize * Math.cos(angle);
            const dy = stepSize * Math.sin(angle);


            if (dx + this.status.Movement.location.x > leftBound && dx + this.status.Movement.location.x < rightBound) { 
                this.status.Movement.location.x += dx;
            }
            if (dy + this.status.Movement.location.y > bottomBound && dy + this.status.Movement.location.y < topBound) { 
                this.status.Movement.location.y += dy;
            }

        }
        else if (pattern == "random") { 

            const xDiff = rightBound - leftBound;
            const yDiff = topBound - bottomBound;

            const newX = Math.random() * xDiff;
            const newY = Math.random() * yDiff;

            this.status.Movement.location.x = newX;
            this.status.Movement.location.y = newY;

        }

        
    }


    move() { 

        this.moveLocation();

        this.callDynamicRangeMove("Color", "ForegroundColor");
        this.callDynamicRangeMove("Color", "BorderColor");
        this.callDynamicRangeMove("Shape", "ElementTilt");
        this.callDynamicRangeMove("Shape", "ElementSize");
        this.callDynamicRangeMove("Shape", "BorderSize");

        
    
    }

    getStaticOrDynamicColor(category, target) { 
        
        if (this.parameters[category][target].isStatic) { 
            return hsvObjectToRgbString(this.parameters[category][target].Static);
        }
        else {
            return getColorFromGradient(this.parameters[category][target].Dynamic, this.status[category][target].pos);
        }

    }

    getStaticOrDynamicLinear(category, target) { 

        if (this.parameters[category][target].isStatic) { 
            return this.parameters[category][target].Static;
        }
        else {
            
            const lowerBound = Math.min(...this.parameters[category][target].Dynamic);
            const upperBound = Math.max(...this.parameters[category][target].Dynamic);
        

            const diff = upperBound - lowerBound;       
            const distance = diff * (this.status[category][target].pos / 100); 


            return lowerBound + distance;

        }
       
    }



   

    drawPolygon(coordinates, borderSize, borderColor, foregroundColor) { 


        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext("2d");

        ctx.beginPath();
        ctx.moveTo(coordinates[0].x, coordinates[0].y);

        for (let i = 0; i < coordinates.length; i++) { 
            ctx.lineTo(coordinates[i].x, coordinates[i].y);
        }

        ctx.closePath();
        ctx.fillStyle = foregroundColor;
        ctx.fill();

        ctx.strokeStyle = borderColor;
        ctx.lineWidth = borderSize;
        ctx.stroke();


    }


    draw() { 

        
        const foregroundColor = this.getStaticOrDynamicColor("Color", "ForegroundColor");
        const borderColor = this.getStaticOrDynamicColor("Color", "BorderColor");

        const elementTilt = this.getStaticOrDynamicLinear("Shape", "ElementTilt");
        const elementSize = this.getStaticOrDynamicLinear("Shape", "ElementSize");
        const borderSize = this.getStaticOrDynamicLinear("Shape", "BorderSize");

        const location = this.status.Movement.location;



        const shape = this.parameters.Shape.ElementShape;

        if (shape == "square") { 
            const coordinates = getSquareCoordinates(location.x, location.y, elementSize, elementTilt);
            this.drawPolygon(coordinates, borderSize, borderColor, foregroundColor);
        }
        else if (shape == "circle") { 

        }
        else if (shape == "triangle") { 

        }

        

        
     

    }





    start(interval) { 
        this.status.Movement.intervalId = setInterval(() => { 
            this.move();
            this.draw();
        }, interval);
        this.status.Movement.isRunning = true;
    }

    stop() { 
        clearInterval(this.status.Movement.intervalId);
        this.status.Movement.isRunning = false;
    }

    run() { 
        if (this.status.Movement.isRunning) { 
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