import { hsvObjectToRgbString, hsvToRgbString, getColorFromGradient } from "../functions/colorFunctions";
import { useRef } from 'react';

class Test { 
    constructor({canvasRef}) { 
        this.canvasRef = canvasRef;
        this.gradientArraySize = 100;
        
        const defaultParameters = {
            size: 10,
            hsv: [100, 100, 100],
            borderSize: 2,
            foregroundStatic: false,
            foregroundColor:  {h: 0, s: 100, v: 100},
            gradient: [
                {color: {h: 0, s: 100, v: 100}, position: 0},
                {color: {h: 70, s: 100, v: 100}, position: 100},
            ],
            gradientLocation: 0,
            gradientStep: 1,
            gradientCycle: "loop",
            gradientDirection: "forward",
        };
        
        this.setParameters(defaultParameters);
    }

    

    setParameters({size, hsv, borderSize, foregroundStatic, foregroundColor, gradient, gradientLocation, gradientStep, gradientCycle, gradientDirection}) { 
 
        console.log("Setting parameters, this.gradientCycle: ", gradientCycle);

        this.size = size;
        this.hsv = hsv;
        this.borderSize = borderSize;
        this.foregroundStatic = foregroundStatic;
        this.foregroundColor = foregroundColor;
        this.gradient = gradient;
        this.gradientLocation = gradientLocation;
        this.gradientStep = gradientStep;
        this.gradientArray = this.storeGradientSteps(this.gradientArraySize);
        this.gradientCycle = gradientCycle;
        this.gradientDirection = gradientDirection;


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
            foregroundStatic: this.foregroundStatic,
            foregroundColor: this.foregroundColor,
            gradient: this.gradient,
            gradientLocation: this.gradientLocation,
            gradientStep: this.gradientStep,
            gradientCyle: this.gradientCycle,
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


        if (this.foregroundStatic) { 
            ctx.fillStyle = hsvObjectToRgbString(this.foregroundColor);
        }
        else{
            const index = Math.floor(this.gradientLocation % this.gradientArraySize);
            const color = this.gradientArray[index];
            ctx.fillStyle = color;


            console.log("this.gradientCycle: ", this.gradientCycle);

            if (this.gradientCycle == "loop") { 
                this.gradientLocation = (this.gradientLocation + this.gradientStep) % this.gradientArraySize;
                console.log("Gradient Location: ", this.gradientLocation);
            }
            else if (this.gradientCycle == "bounce") { 

            }
            
            
            
        }

        
        ctx.fillRect(x, y, this.size, this.size);

    }


    draw() { 
        
        
        this.drawSquare();

    }


}

export default Test;