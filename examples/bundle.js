(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

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

},{"..":2}],2:[function(require,module,exports){

module.exports.encode = require( './src/encode' ).encode;

},{"./src/encode":3}],3:[function(require,module,exports){
'use strict';

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
    };

/*
    vsvg-paths
    ---------------------------------------------------
    this is a small module to encode decode svg pathing

    encode - encode object collection to path string
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

*/

module.exports.encode = 
function encode( path, isRelative ) {
    
    if ( !Array.isArray( path ) ) {
        return;
    }
    var instructions = path.map( getInstruction ),
        values;

    if ( isRelative ) {
        instructions = instructions.map( mapLowerCase );
    }
    values = path.map( keyValueArray ) // [ [ [ y, 0 ], [ x, 0 ] ] ]
            .map( sortPoints ) // [ [ x, 0 ], [ y, 0 ] ] according to sort values
            .map( stringifyPoints( instructions ) );  // [ 'M0 0' ];
    
    return values.join( ' ' );
};

var keyValueArray =
module.exports._keyValueArray =
function keyValueArray( points ) {
    var ret = [];
    for( var key in points ) {
        ret.push( [ key, points[ key ] ] );
    }
    return ret;
};

var mapLowerCase =
module.exports._mapLowerCase = 
function mapLowerCase ( str ) {
    return str.toLowerCase();
};

var getValue =
module.exports._getValue =
function getValue(  instr ) {
    return function ( point, index ) {
        return ( !index ? instr : '' ) + point[ 1 ];
    }
};

var sortValue =
module.exports._sortValue =
function sortValue ( prev, cur ) {
    return sortValues[ prev[ 0 ] ] - sortValues[ cur[ 0 ] ];
};

var sortPoints =
module.exports._sortPoints =
function sortPoints ( points ) {
    return points.sort( sortValue );
};

var stringifyPoints =
module.exports._stringifyPoints =
function stringifyPoints( instructions ) {
    return function( point, index ) {
        if ( !point.length ) {
            return instructions[ index ]; // should be a close
        }
        return point.map( getValue( instructions[ index ] ) ).join( ' ' );
    }
};

var isValid =
module.exports._isValid =
function isValid ( value ) {
    if ( isNaN( value ) ) {
        return false;
    }
    return value || typeof value === 'number';
};

var getInstruction =
module.exports._getInstruction =
function getInstruction ( points, index ) {
    if ( isValid( points.x2 )  && isValid( points.y2 ) && isValid( points.x1 ) && isValid( points.y1 ) ) {
        return 'C';
    }
    if ( isValid( points.rx ) && isValid( points.ry ) ) {
        return 'A';
    }
    if ( isValid( points.x1 ) && isValid( points.y1 ) ) {
        return 'Q';
    }
    if ( isValid( points.x2 ) && isValid( points.y2 ) ) {
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
    return 'Z';
};


},{}]},{},[1]);
