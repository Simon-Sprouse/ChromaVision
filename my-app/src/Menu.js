import { useRef, useEffect, useState } from 'react'
import Test from './algos/Test';

function Menu() { 

    const canvasRef = useRef(null);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const algoRef = useRef(null);

    // set up canvas and algo
    useEffect(() => { 

        if (canvasRef.current) { 
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            ctx.fillStyle = "tan";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            

            const test = new Test({canvasRef});
            algoRef.current = test;
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
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => { 
            document.removeEventListener("keydown", handleKeyDown);
        }
    })


    // handle menu blur
    useEffect(() => { 
        if (isMenuOpen) { 
            document.body.style.filter = "blur(10px)";
        }
        else { 
            document.body.style.filter = "none";
        }
    }, [isMenuOpen]);

    
    

    return (
        <>

            <canvas ref={canvasRef} width="1200" height="400"></canvas>
        </>
    )
}


export default Menu;