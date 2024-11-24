import { useRef, useEffect, useState } from 'react'
import Test from './algos/Test';
import TestMenu from './menus/TestMenu';

function Menu() { 

    const canvasRef = useRef(null);


    const [menuOption, setMenuOption] = useState("canvas");
   




    const algoRef = useRef(null);
    const [mode, setMode] = useState("test"); // algo type
    const [parameters, setParameters] = useState({});
    


    // set up mode
    useEffect(() => { 
        if (mode == "test") { 
            const test = new Test({canvasRef});
            algoRef.current = test;
            
            const defaultParameters = algoRef.current.getParameters();
            setParameters(defaultParameters);
        }
    }, [mode]);


    // set up canvas
    useEffect(() => { 

        if (canvasRef.current) { 
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            function handleResize() { 

                const originalImage = canvas.toDataURL();
                const oldWidth = canvas.width;
                const oldHeight = canvas.height;

                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                
                // ctx.clearRect(0, 0, canvas.width, canvas.height);

                const img = new Image();
                img.src = originalImage;
                img.onload = () => {
                   
                    ctx.drawImage(img, 0, 0, oldWidth, oldHeight);
                }

            }


            handleResize();
            window.addEventListener("resize", handleResize);
            return () => { 
                window.removeEventListener("resize", handleResize);
            }
        }
        

    }, []);

    // handle ui events
    useEffect(() => { 
        function handleKeyDown(event) { 
            if (event.key == "Escape") { 
                /*
                So I suspect that this component has an event listener that is persisting. 
                If this is true, I can represent any menu state in the parent, passing a state and statemodifer down to chilren
                I will now test to see what control I can get in the parent component
                */


                /*
                The escape key moves you backward in the menu stack. 
                edit -> main -> canvas
                or as seen in this if statement: 

                if canvas:          // the only time the escape key takes you forward in the menu stack
                    go to main
                if main
                    go to canvas
                if edit: 
                    go to main



                if gradient:
                    go to edit






                canvas -> main
                main -> canvas


                main -> edit


                edit -> color, shape, movement

                color -> gradient
                */

                if (menuOption == "canvas") { 
                    setMenuOption("main");
                }
                else if (menuOption == "main") {
                    setMenuOption("canvas");
                }
                else if (menuOption == "edit") { 
                    setMenuOption("main");
                }
                else if (menuOption == "color") {
                    setMenuOption("edit");
                }
                else if (menuOption == "shape") {
                    setMenuOption("edit");
                }
                else if (menuOption == "movement") {
                    setMenuOption("edit");
                }
                else if (menuOption == "gradient") {
                    setMenuOption("color");
                }
                







                else { 
                    // handle error in menuOption state
                    setMenuOption("canvas");
                }
                
            }
            else if (event.key == "t" && algoRef.current) { 
                runAlgo();
            }
            else if (event.key == "Backspace") { 
                resetBackground();
            }
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => { 
            document.removeEventListener("keydown", handleKeyDown);
        }
    })


    // handle menu blur
    useEffect(() => { 
       

        if (menuOption != "canvas") { 
            document.getElementById("canvas").style.filter = "blur(10px)";
        }
        else { 
            document.getElementById("canvas").style.filter = "none";
        }
    }, [menuOption]);

    


    function runAlgo() { 
        if (algoRef.current) { 
            algoRef.current.draw();
        }
    }

    function resetBackground() { 
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }



    

    function saveCanvas() { 

        const canvas = canvasRef.current;
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");

    
        link.href = image;
        const unixTime = Math.floor(Date.now() / 1000);
        link.download = `canvas-${unixTime}`;
        link.click();
    }



    function testSetParameters() {
        const params  = {
            size: 20,
            hsv: [300, 100, 100],
            borderSize: 4
        }
        setParameters(params);
        if (algoRef.current) { 
            algoRef.current.setParameters(parameters);
        }
    }

    return (
        <>

            <canvas id={"canvas"} ref={canvasRef}></canvas>

            {menuOption == "main" && (
                <div className={"menuDiv"}>
                    <p>Main</p>
                    <button onClick={() => {setMenuOption("edit")}}>Edit Settings</button>
                    <button onClick={saveCanvas}>Save Canvas</button>
                    <button>Back</button>
                    <button>Help</button>
                    <button onClick={testSetParameters}>Test</button>
                </div>

            )}
            {menuOption != "canvas" && menuOption != "main" && parameters && (
                <>
                    <TestMenu 
                        menuOption={menuOption} 
                        setMenuOption={setMenuOption} 
                        parameters={parameters} 
                        setParameters={setParameters} 
                        algoRef={algoRef}/>
                </>
                
            )}

        </>
    )
}


export default Menu;







/*

Ok so here's a basic sketch of what the menu needs to look like: 

canvas

- main
    - edit
        - color
            - background color
            - border color
            - snake color
        - shape (maybe form is a better name? )
            - shape
            - size
            - borderSize (make this a ratio?)
            - tilt
        - movement
            - animation speed
            - walking pattern
    - save
    - back
    - help
    - test (maybe randomize)






*/