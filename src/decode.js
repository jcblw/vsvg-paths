
'use strict';

var eachInstPattern = /([a-z]+(-?[0-9]*\s*)+)/gi,
    instPattern = /([A-Z]|-?[0-9]+)/gi,
    alphastart = /^[A-Z]/i;

function splitInstruction ( instruction ) {
    return instruction.split( instPattern )
            .filter( filterNull )
            .map( trimEach )
            .filter( filterNull );
}

function startsWithAlpha ( instruction ) {
    return alphastart.test( instruction );
}

function createPoint ( instruction ) {
    var type = instruction[ 0 ].toUpperCase();
    if ( type === 'V' ) {
        return {
            y: +instruction[ 1 ] 
        };
    }
    if ( type === 'H' ) {
        return {
            x: +instruction[ 1 ]
        };
    }
    if ( type === 'L' || type === 'M' ) {
        return {
            x : +instruction[ 1 ],
            y: +instruction[ 2 ]
        };
    }
    if ( type === 'S' ) {
        return {
            x2: +instruction[ 1 ],
            y2: +instruction[ 2 ],
            x: +instruction[ 3 ],
            y: +instruction[ 4 ]
        };
    }
    if ( type === 'Q' ) {
        return {
            x1: +instruction[ 1 ],
            y1: +instruction[ 2 ],
            x: +instruction[ 3 ],
            y: +instruction[ 4 ]
        };
    }
    if ( type === 'A' ) {
        return {
            rx: +instruction[ 1 ],
            ry: +instruction[ 2 ],
            xrotate: +instruction[ 3 ],
            largearc: +instruction[ 4 ],
            sweep: +instruction[ 5 ],
            x: +instruction[ 6 ],
            y: +instruction[ 7 ]
        };
    }
    if ( type === 'C' ) {
        return {
            x1: +instruction[ 1 ],
            y1: +instruction[ 2 ],
            x2: +instruction[ 3 ],
            y2: +instruction[ 4 ],
            x: +instruction[ 5 ],
            y: +instruction[ 6 ]
        };
    }
    // need to support T https://github.com/jcblw/vsvg-paths/issues/3
    return {};
}

function filterNull ( n ) {
    return n;
}

function trimEach( str ) {
    return str.trim();
}

module.exports.decode = function ( pathData ) {

    var instructions = pathData.split( eachInstPattern )
            .filter( filterNull )
            .filter( startsWithAlpha )
            .map( splitInstruction )
            .map( createPoint );

    return instructions;
    
}
