'use strict'

var sortValues = {
        x1: 0,
        y1: 1,
        x2: 2,
        y2: 3,
        rx: 4,
        ry: 5,
        xrotate: 6,
        largearc: 7,
        sweep: 8,
        x: 9,
        y: 10
    }

/*
    vsvg-paths.encode - encode object collection to path string
    ------------------------------------------------------------------
    
    params
        path { Array } - an array of points some exmaple points ar as follows
            [ 
                { x: 5, y: 5 }, // moveto
                { x: 100, y: 200 }, // lineto
                { x1: 100 , y1: 100, x2: 250, y2: 100, x: 250, y: 200 } // curveto
                { x2: 400, y2: 300, x: 400, y: 200 } // shorthand curve
                { x: 500 } // horizontal line
                { y: 100 } // vertical line
            ]
            with encode to: M5 5 L100 100 C100 100 250 100 250 200 S400 300 400 200 H500 V100
        isRelative { Boolean } - flag to make paths relative
    returns
        pathData { String } - the encoded string 

*/

module.exports.encode = 
function encode( path ) {
    
    if ( !Array.isArray( path ) ) {
        return
    }
    var instructions = path.map( getInstruction ),
        values

    values = path.map( keyValueArray ) // [ [ [ y, 0 ], [ x, 0 ] ] ]
            .map( sortPoints ) // [ [ x, 0 ], [ y, 0 ] ] according to sort values
            .map( stringifyPoints( instructions ) )  // [ 'M0 0' ]
    
    return values.join( ' ' )
}

var keyValueArray =
module.exports._keyValueArray =
function keyValueArray( points ) {
    var ret = []
    for( var key in points ) {
        if ( !( key === 'rel' || key === 'relative' ) ) {
            ret.push( [ key, points[ key ] ] )
        }
    }
    return ret
}

var getValue =
module.exports._getValue =
function getValue(  instr ) {
    return function ( point, index ) {
        return ( !index ? instr : '' ) + point[ 1 ]
    }
}

var sortValue =
module.exports._sortValue =
function sortValue ( prev, cur ) {
    return sortValues[ prev[ 0 ] ] - sortValues[ cur[ 0 ] ]
}

var sortPoints =
module.exports._sortPoints =
function sortPoints ( points ) {
    return points.sort( sortValue )
}

var stringifyPoints =
module.exports._stringifyPoints =
function stringifyPoints( instructions ) {
    return function( point, index ) {
        if ( !point.length ) {
            return instructions[ index ] // should be a close
        }
        return point.map( getValue( instructions[ index ] ) ).join( ' ' )
    }
}

var isValid =
module.exports._isValid =
function isValid ( value ) {
    if ( isNaN( value ) ) {
        return false
    }
    return value || typeof value === 'number'
}

var getInstruction =
module.exports._getInstruction =
function getInstruction ( points, index ) {
    var instruction
    if ( isValid( points.x2 )  && isValid( points.y2 ) && isValid( points.x1 ) && isValid( points.y1 ) ) {
        instruction = 'C'
    }
    if ( !instruction && isValid( points.rx ) && isValid( points.ry ) ) {
        instruction = 'A'
    }
    if ( !instruction && isValid( points.x1 ) && isValid( points.y1 ) ) {
        instruction = 'Q'
    }
    if ( !instruction && isValid( points.x2 ) && isValid( points.y2 ) ) {
        instruction = 'S'
    }
    if ( !instruction && isValid( points.x ) && isValid( points.y ) ) {
        instruction = 'L'
        if ( !index ) {
            instruction = 'M'
        }
    }
    if ( !instruction && isValid( points.x ) ) {
        instruction = 'H'
    }
    if ( !instruction && isValid( points.y ) ) {
        instruction = 'V'
    }
    if ( !instruction ) {
        instruction = 'Z'
    }
    return points.relative || points.rel ? instruction.toLowerCase() : instruction
}