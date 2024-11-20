import { useRef, useEffect, useState } from 'react'
import Test from './algos/Test';

function Menu() { 

    const canvasRef = useRef(null);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const algoRef = useRef(null);

    const [mode, setMode] = useState("test");






    // set up mode
    useEffect(() => { 
        if (mode == "test") { 
            const test = new Test({canvasRef});
            algoRef.current = test;
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
                setIsMenuOpen(prev => !prev);
            }
            else if (event.key == "t" && algoRef.current) { 
                algoRef.current.draw();
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

    



    function resetBackground() { 
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "tan";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    

    return (
        <>

            <canvas id={"canvas"} ref={canvasRef}></canvas>

            {isMenuOpen && (
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
                    <button>Option 1</button>
                    <button>Option 2</button>
                </div>
            )}


        </>
    )
}


export default Menu;