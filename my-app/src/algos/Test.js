import { hsvObjectToRgbString, hsvToRgbString } from "../functions/colorFunctions";
import { useRef } from 'react';

class Test { 
    constructor({canvasRef}) { 
        this.canvasRef = canvasRef;
        
        const defaultParameters = {
            size: 10,
            hsv: [100, 100, 100],
            borderSize: 2
        };
        
        this.setParameters(defaultParameters);
    }

    

    setParameters({size, hsv, borderSize}) { 

        // console.log("Setting parameters", size, hsv , borderSize);

        this.size = size;
        this.hsv = hsv;
        this.borderSize = borderSize;
    }

    getParameters() { 
        return {
            size: this.size,
            hsv: this.hsv,
            borderSize: this.borderSize
        }
    }

    drawSquare() { 
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext("2d");

        const x = Math.random() * (canvas.width - this.size);
        const y = Math.random() * (canvas.height - this.size);


        const rectBorderSize = (this.size) + (2 * this.borderSize);

        ctx.fillStyle = "black";
        ctx.fillRect(x - this.borderSize, y - this.borderSize, rectBorderSize, rectBorderSize);

        ctx.fillStyle = hsvToRgbString(...this.hsv);
        ctx.fillRect(x, y, this.size, this.size);

    }


    draw() { 
        
        
        this.drawSquare();

    }


}

export default Test;