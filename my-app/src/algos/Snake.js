import { hsvObjectToRgbString } from "../colorFunctions/colorFunctions";

class Snake { 

    constructor({ canvasRef, parameters }) {
        this.canvasRef = canvasRef;
        this.parameters = parameters;
        this.status = {
            location: {x: 200, y: 200}
        };
    }

    setParameters(parameters) { 
        this.parameters = parameters;
    }

    move() { 
        const stepSize = this.parameters.Movement.StepSize;
        const angle = Math.random() * 2 * Math.PI;

        const dx = stepSize * Math.cos(angle);
        const dy = stepSize * Math.sin(angle);

        this.status.location.x += dx;
        this.status.location.y += dy;

    }


    draw() { 



        const foregroundColor = hsvObjectToRgbString(this.parameters.Color.ForegroundColor.Static);
        const borderColor = hsvObjectToRgbString(this.parameters.Color.BorderColor.Static);
        const elementSize = this.parameters.Shape.ElementSize.Static;
        const borderSize = this.parameters.Shape.BorderSize.Static;
  

        const location = this.status.location;


        

        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext("2d");


        console.log("borderColor: ", borderColor);
        console.log("location: ", location);
        console.log("elementSize: ", elementSize);
        console.log("borderSize: ", borderSize);

        
        ctx.fillStyle = borderColor;
        ctx.fillRect(location.x, location.y, elementSize  + 2*borderSize, elementSize + 2*borderSize);

        ctx.fillStyle = foregroundColor;
        ctx.fillRect(location.x + borderSize, location.y + borderSize, elementSize, elementSize);


        console.log("Draw should occur");

    }

}

export default Snake;