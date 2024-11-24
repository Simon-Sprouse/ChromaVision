import { useState, useEffect } from 'react';
import GradientUI from '../functions/GradientUI';

function TestMenu({ menuOption, setMenuOption, parameters, setParameters, algoRef }) { 

   

    const localParameters = {...parameters};



 
    

    function sizeChange(event) {
        localParameters.size = parseInt(event.target.value);
        applyLocalParameters();
    }   

    function sizeModulation(event) { 

        const button = document.getElementById("sizeMod");
        if (event.target.innerText === "Fixed") { 
            button.innerText = "Loop";
        }
        else if (event.target.innerText === "Loop") { 
            button.innerText = "Bounce";
        }
        else if (event.target.innerText === "Bounce") { 
            button.innerText = "Fixed";
        }
    }

    function borderSizeChange(event) {
        localParameters.borderSize = parseInt(event.target.value);
        applyLocalParameters();
    }

    function applyLocalParameters() { 
        algoRef.current.setParameters(localParameters);
        setParameters(localParameters);
    }




    function handleChangeFromGradientUI(gradient) { 
        localParameters.gradient = gradient;
        algoRef.current.setParameters(localParameters);
        setParameters(localParameters);
    }

    return (
        <>
        

        {(menuOption == "edit") && (
            <div className={"menuDiv"}>
                <p>Edit</p>
                <button onClick={() => {setMenuOption("color")}}>Color</button>
                <button onClick={() => {setMenuOption("shape")}}>Shape</button>
                <button onClick={() => {setMenuOption("movement")}}>Movement</button>
            </div>
        )}


        {(menuOption == "color") && (
            <div className={"menuDiv"}>
                <p>Color</p>
                <button onClick={() => {setMenuOption("gradient")}}>Set Gradient</button>
            </div>
        )}
       
        {(menuOption == "shape") && (
            <div className={"menuDiv"}>
                <p>Shape</p>
                <span className="menuRow">
                    <p>Size</p>
                    <input type="range" min="2" max="200" defaultValue={parameters.size} onChange={sizeChange}/>
                </span>
                <span className="menuRow">
                    <p>Border Size</p>
                    <input type="range" min="2" max="200" defaultValue={parameters.borderSize} onChange={borderSizeChange}/>
                </span>
                
            </div>
        )}

        {(menuOption == "movement") && (
            <div className={"menuDiv"}>
                <p>Movement</p>
            </div>
        )}
        


        {(menuOption == "gradient") && (
            <div className={"menuDiv"}>
                <p>Gradient</p>
                <GradientUI width={400} defaultGradient={localParameters.gradient} onUpdate={handleChangeFromGradientUI}/>
            </div>
        )}



       
        </>
    )
}

export default TestMenu;