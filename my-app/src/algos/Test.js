import { hsvObjectToRgbString, hsvToRgbString, getColorFromGradient } from "../functions/colorFunctions";
import { useRef } from 'react';

class Test { 
    constructor({canvasRef}) { 
        this.canvasRef = canvasRef;
        
        const defaultParameters = {
            size: 10,
            hsv: [100, 100, 100],
            borderSize: 2,
            gradient: [
                {color: {h: 0, s: 100, v: 100}, position: 0},
                {color: {h: 70, s: 100, v: 100}, position: 100},
            ],
            gradientLocation: 0,
            gradientStep: 1
        };
        
        this.setParameters(defaultParameters);
    }

    

    setParameters({size, hsv, borderSize, gradient, gradientLocation, gradientStep}) { 

        // console.log("Setting parameters", gradient);

        this.size = size;
        this.hsv = hsv;
        this.borderSize = borderSize;
        this.gradient = gradient;
        this.gradientLocation = gradientLocation;
        this.gradientStep = gradientStep;
        this.gradientArray = this.storeGradientSteps(100);


    }

    storeGradientSteps(numberOfSteps) { 



       


        const gradientArray = [];
        for (let i = 0; i < numberOfSteps; i ++) { 
            const distance = i * (100 / numberOfSteps);
            const colorString = getColorFromGradient(this.gradient, distance);
            gradientArray.push(colorString);
        }

        return gradientArray;
    }


    getParameters() { 
        return {
            size: this.size,
            hsv: this.hsv,
            borderSize: this.borderSize,
            gradient: this.gradient,
            gradientLocation: this.gradientLocation,
            gradientStep: this.gradientStep
        }
    }

    drawSquare() { 
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext("2d");

        const x = Math.random() * (canvas.width - this.size);
        const y = Math.random() * (canvas.height - this.size);


        const rectBorderSize = (this.size) + (2 * this.borderSize);



        const index = Math.floor(this.gradientLocation % 100);
        const color = this.gradientArray[index];
        this.gradientLocation += this.gradientStep;







        ctx.fillStyle = "black";
        ctx.fillRect(x - this.borderSize, y - this.borderSize, rectBorderSize, rectBorderSize);



        ctx.fillStyle = color;
        ctx.fillRect(x, y, this.size, this.size);

    }


    draw() { 
        
        
        this.drawSquare();

    }


}

export default Test;