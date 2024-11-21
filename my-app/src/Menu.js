import { useRef, useEffect, useState } from 'react'
import Test from './algos/Test';
import TestMenu from './menus/TestMenu';

function Menu() { 

    const canvasRef = useRef(null);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuOption, setMenuOption] = useState(null);
    const algoRef = useRef(null);

    const [mode, setMode] = useState("test");


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
                if (menuOption) { 
                    setMenuOption(null);
                }
                else {
                    setIsMenuOpen(prev => !prev);
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
        if (isMenuOpen) { 
            document.getElementById("canvas").style.filter = "blur(10px)";
        }
        else { 
            document.getElementById("canvas").style.filter = "none";
        }
    }, [isMenuOpen]);

    


    function runAlgo() { 
        if (algoRef.current) { 
            algoRef.current.draw();
        }
    }

    function resetBackground() { 
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "tan";
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

            {isMenuOpen && !menuOption && (
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
                    <button onClick={() => {setMenuOption("edit")}}>Edit Settings</button>
                    <button onClick={saveCanvas}>Save Canvas</button>
                    <button>Back</button>
                    <button>Help</button>
                    <button onClick={testSetParameters}>Test</button>
                </div>

            )}
            {menuOption == "edit" && parameters && (
                <>
                    <TestMenu parameters={parameters} setParameters={setParameters} algoRef={algoRef}/>
                </>
                
            )}

        </>
    )
}


export default Menu;