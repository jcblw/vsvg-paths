'use strict';

/*
    vsvg-paths
    ---------------------------------------------------
    this is a small module to encode decode svg pathing

    encode 
    [ 
        { x: 5, y: 5 }, // moveto
        { x: 100, y: 200 }, // lineto
        { x1: 100 , y1: 100, x2: 250, y2: 100, x: 250, y: 200 } // curveto
        { x1: 400, y1: 300, x: 400, y: 200 } // shorthand curve
        { x: 500 } // horizontal line
        { y: 100 } // vertical line
    ]
    with encode to: M5 5 L100 100 C100 100 250 100 250 200 S400 300 400 200 H500 V100
*/

var sortValues = {
        x1: 0,
        y1: 1,
        x2: 2,
        y2: 3,
        x: 4,
        y: 5
    };

function keyValueArray( points ) {
    var ret = [];
    for( var key in points ) {
        ret.push( [ key, points[ key ] ] );
    }
    return ret;
}

function getValue(  instr ) {
    return function ( point, index ) {
        return ( !index ? instr : '' ) + point[ 1 ];
    }
}

function sortValue ( prev, cur ) {
    return sortValues[ prev[ 0 ] ] - sortValues[ cur[ 0 ] ];
}

function sortPoints ( points ) {
    return points.sort( sortValue );
}

function stringifyPoints( instructions ) {
    return function( point, index ) {
        return point.map( getValue( instructions[ index ] ) ).join( ' ' );
    }
}

function isValid ( value ) {
    return value || typeof value === 'number';
}

function getInstruction ( points, index, arr ) {
    if ( isValid( points.x2 )  && isValid( points.y2 ) ) {
        return 'C';
    }
    if ( isValid( points.x1 ) && isValid( points.y1 ) ) {
        return 'S';
    }
    if ( isValid( points.x ) && isValid( points.y ) ) {
        if ( !index ) {
            return 'M';
        }
        return 'L';
    }
    if ( isValid( points.x ) ) {
        return 'H';
    }
    if ( isValid( points.y ) ) {
        return 'V';
    }
}
module.exports.encode = function encode( path ) {
    
    if ( !Array.isArray( path ) ) {
        return;
    }
    var instructions = path.map( getInstruction ),
        values = path.map( keyValueArray ) // [ [ [ y, 0 ], [ x, 0 ] ] ]
            .map( sortPoints ) // [ [ x, 0 ], [ y, 0 ] ] according to sort values
            .map( stringifyPoints( instructions ) );  // [ 'M0 0' ];
    
    return values.join( ' ' );
}
