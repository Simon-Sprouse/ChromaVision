import { useState, useEffect } from 'react';
import GradientUI from '../functions/GradientUI';
import ColorWheel from '../functions/ColorWheel';
import DisplayBar from '../functions/DisplayBar';

function TestMenu({ menuOption, setMenuOption, parameters, setParameters, algoRef }) { 

   const [foregroundStatic, setForegroundStatic] = useState(false);


    const localParameters = {...parameters};


    function applyLocalParameters() { 
        algoRef.current.setParameters(localParameters);
        setParameters(localParameters);
    }
 
    

    function sizeChange(event) {
        localParameters.size = parseInt(event.target.value);
        applyLocalParameters();
    }   


    function borderSizeChange(event) {
        localParameters.borderSize = parseInt(event.target.value);
        applyLocalParameters();
    }











    function toggleForeground(event) { 
        // TODO make this a slider instead
        if (localParameters.foregroundStatic) { 
            event.target.innerText = "Set Static"; // opposite
            localParameters.foregroundStatic = false;
            applyLocalParameters();
        } 
        else { 
            event.target.innerText = "Set Gradient"; // opposite
            localParameters.foregroundStatic = true;
            applyLocalParameters();
        }
    }

    // called from inside color wheel
    function handleForegroundStaticColorChange(hsv) { 
        localParameters.foregroundColor = hsv;
        applyLocalParameters();
    }


    // called from inside gradient UI
    function handleChangeFromGradientUI(gradient) { 
        localParameters.gradient = gradient;
        applyLocalParameters();
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
                
                <button onClick={toggleForeground}>Set Static</button>
                {localParameters.foregroundStatic && (
                    <div>
                        <p>Fleeb</p>
                        
                        <ColorWheel 
                            width={400}
                            hsv={localParameters.foregroundColor}
                            counter={0}
                            updateHsv={handleForegroundStaticColorChange}
                        />
                        

                    </div>
                )}
                {!localParameters.foregroundStatic && (
                    <div>
                        <DisplayBar 
                            width={200}
                            height={20} 
                            hsvValues={localParameters.gradient.map(colorStop => colorStop.color)}
                            positions={localParameters.gradient.map(colorStop => colorStop.position / 100)}
                            style={0}
                            numPanels={7}
                        />
                        <button onClick={() => {setMenuOption("gradient")}}>Open Gradient Editor</button>
                    </div>
                )}
                
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