import { useState, useEffect } from 'react';
import GradientUI from '../functions/GradientUI';

function TestMenu({ parameters, setParameters, algoRef }) { 

    const localParameters = {...parameters};

    const [inGradientUI, setInGradientUI] = useState(false);


    const defaultHsv = {h: 120, s:90, v:80}; // TODO set this based on the existing values

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

    function handleGradientUI() { 
        setInGradientUI(true);
    }



    function handleChangeFromGradientUI(gradient) { 
        localParameters.gradient = gradient;
        algoRef.current.setParameters(localParameters);
        setParameters(localParameters);
    }

    return (
        <>
        {!inGradientUI && (
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    background: "rgba(255, 255, 255, 0.8)",
                    padding: "20px",
                    borderRadius: "10px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    zIndex: "1000",
                    filter: "none"
                }}
            >
                <span className="menuRow">
                    <p>Size</p>
                    <input type="range" min="2" max="200" defaultValue={parameters.size} onChange={sizeChange}/>
                    {/* <button id="sizeMod" onClick={sizeModulation}>Fixed</button>
                    <input type="range" min="1" max="100" defaultValue={100} /> */}
                </span>
                <span className="menuRow">
                    <p>Border Size</p>
                    <input type="range" min="2" max="200" defaultValue={parameters.borderSize} onChange={borderSizeChange}/>

                </span>
                <button onClick={handleGradientUI}>Select Gradient</button>
            </div>
        )}
        {inGradientUI && (
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    background: "rgba(255, 255, 255, 0.8)",
                    padding: "20px",
                    borderRadius: "10px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    zIndex: "1000",
                    filter: "none"
                }}
            >
                <GradientUI width={400} defaultHsv={defaultHsv} onUpdate={handleChangeFromGradientUI}/>
            </div>
        )}
        </>
    )
}

export default TestMenu;