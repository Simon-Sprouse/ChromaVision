import { hsvObjectToRgbString, getColorFromGradient } from "../colorFunctions/colorFunctions";

class Snake { 

    constructor({ canvasRef, parameters }) {
        this.canvasRef = canvasRef;

        this.parameters = parameters;
        this.status = {
            isRunning: false,
            intervalId: null,
            location: {x: 200, y: 200},
            foregroundColorPos: 0,
        };
        
    }


    setParameters(parameters) { 
        this.parameters = parameters;
        if (this.status.isRunning) { 
            this.stop();
            const speed = (100 - this.parameters.Movement.Speed);
            const interval = this.nonLinearScale(speed, 4, 3000);
            this.start(interval);
        }
    }

    nonLinearScale(input, outputMin, outputMax) {

        const normalizedInput = input / 100; // maps input to [0, 1]
        const scaledValue = outputMin * Math.pow((outputMax/outputMin), normalizedInput);

        return scaledValue;
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


        const shiftSpeed = parseInt(this.parameters.Color.ForegroundColor.ShiftSpeed);
        const colorStep = this.nonLinearScale(shiftSpeed, 0.001, 99);

        console.log("Color Step: ", colorStep);

        this.status.foregroundColorPos = (this.status.foregroundColorPos + colorStep) % 100;




    
    }


    draw() { 



        let foregroundColor; 


        if (this.parameters.Color.ForegroundColor.isStatic) { 
            foregroundColor = hsvObjectToRgbString(this.parameters.Color.ForegroundColor.Static);
        }
        else {
            foregroundColor = getColorFromGradient(this.parameters.Color.ForegroundColor.Dynamic, this.status.foregroundColorPos);
        }





        const borderColor = hsvObjectToRgbString(this.parameters.Color.BorderColor.Static);
        const elementSize = this.parameters.Shape.ElementSize.Static;
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