import { hsvObjectToRgbString, hsvToRgbString } from "../functions/colorFunctions";
import { useRef } from 'react';

class Test { 
    constructor({canvasRef}) { 
        this.canvasRef = canvasRef;
        
        const defaultParameters = {
            size: 100,
            hsv: [100, 100, 100],
        }
        
        this.setParameters(defaultParameters);
    }

    setParameters({size, hsv}) { 
        this.size = size;
        this.hsv = hsv;
    }


    draw() { 
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext("2d");


        
        ctx.fillStyle = hsvToRgbString(...this.hsv);
        ctx.fillRect(Math.random() * 300, Math.random() * 100, this.size, this.size);
        


    }


}

export default Test;