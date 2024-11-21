import { useState, useEffect } from 'react';

function TestMenu({ parameters, setParameters, algoRef }) { 

    const localParameters = {...parameters};




    function sizeChange(event) {
        localParameters.size = parseInt(event.target.value);
        applyLocalParameters();
    }   

    function borderSizeChange(event) {
        localParameters.borderSize = parseInt(event.target.value);
        applyLocalParameters();
    }

    function applyLocalParameters() { 
        algoRef.current.setParameters(localParameters);
        setParameters(localParameters);
    }



    return (
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
            <p>Size</p>
            <input type="range" min="2" max="200" defaultValue={parameters.size} onChange={sizeChange}/>
            <p>Border Size</p>
            <input type="range" min="2" max="200" defaultValue={parameters.borderSize} onChange={borderSizeChange}/>
        </div>
    )
}

export default TestMenu;