



function getSquareCoordinates(centerX, centerY, sideLength, tilt) { 


    const X = parseInt(centerX);
    const Y = parseInt(centerY);
    const S = parseInt(sideLength);
    const theta = parseInt(tilt) * (Math.PI / 180);


    const A = S * Math.cos(theta);
    const O = S * Math.sin(theta);
    const L = 0.5 * (A + O);


    const top = {x: X - L + O, y: Y - L};
    const right = {x: X + L, y: Y - L + O};
    const bottom = {x: X - L + A, y: Y + L};
    const left = {x: X - L, y: Y - L + A};


    const points = [top, right, bottom, left];
    return points;


}


export { getSquareCoordinates };