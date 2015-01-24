
var encode = require( '..' ).encode,
    value = [ 
        { x: 5, y: 5 }, // moveto
        { x: 100, y: 200 }, // lineto
        { x1: 100 , y1: 100, x2: 250, y2: 100, x: 250, y: 200 }, // curveto
        { x2: 400, y2: 300, x: 400, y: 200 }, // shorthand curve
        { x: 500 }, // horizontal line
        { y: 100 }, // vertical line
        {
            rx: 25,
            ry: 25,
            xrotate: -30,
            largearc: 0,
            sweep: 1,
            x: 250,
            y: 250
        },
        {
            x1: 100,
            y1: 300,
            x: 25,
            y: 250
        },
        {}
    ],
    path = document.querySelector( 'path' ),
    dup = changeArray( value, 10 ),
    anotherdup = changeArray( dup, -20 );

function changeArray( arr, change ) {
   return arrayDup( arr ).reverse().map( minusDiff( change ) );
}

function arrayDup( arr ) {
    return arr.slice().map( objDup );    
}

function objDup( obj ) {
    return Object.create( obj );
}

function minusDiff( amount ) {
    return function( point, index ) {
        for ( var key in point ) {
            point[ key ] = point[ key ] - amount;
        }
        return point;
    }
}

//value = value.concat( dup ).concat( anotherdup );

path.setAttribute( 'd', encode( value ) );

console.log( encode( value ) );
