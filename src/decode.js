
'use strict';

var eachInstPattern = /(([a-z]+)(\s?\,?(\-?[0-9]+\.?[0-9]*))+)/gi,
    instPattern = /([a-z]+)|(\-?[0-9]+\.?[0-9]*)/gi,
    alphastart = /^[A-Z]/i

// split instructions nicely /([a-z]+)|\s?\,?(\-?[0-9]+\.?[0-9]*)/gi
// pull only the good values out /([a-z]+)|(\-?[0-9]+\.?[0-9]*)/gi

function splitInstruction ( instruction ) {
    return instruction.match( instPattern )
            .filter( filterNull )
            .map( trimEach )
            .filter( filterNull )

}

function startsWithAlpha ( instruction ) {
    return alphastart.test( instruction )
}

function multiPoint( instruction, length ) {
    if ( instruction.length <= length ) {
        return
    }

    var next = instruction.slice( length )

    next.unshift( instruction[0] )
    // now jump back into create point
}

function createPoint ( instruction ) {
    // console.log( instruction )
    var type = instruction[ 0 ].toUpperCase();
    if ( type === 'V' ) {
        multiPoint( instruction, 2 )
        return {
            y: +instruction[ 1 ]
        }
    }
    if ( type === 'H' ) {
        multiPoint( instruction, 2 )
        return {
            x: +instruction[ 1 ]
        }
    }
    if ( type === 'L' || type === 'M' ) {
        multiPoint( instruction, 3 )
        return {
            x : +instruction[ 1 ],
            y: +instruction[ 2 ]
        }
    }
    if ( type === 'S' ) {
        multiPoint( instruction, 5 )
        return {
            x2: +instruction[ 1 ],
            y2: +instruction[ 2 ],
            x: +instruction[ 3 ],
            y: +instruction[ 4 ]
        }
    }
    if ( type === 'Q' ) {
        multiPoint( instruction, 5 )
        return {
            x1: +instruction[ 1 ],
            y1: +instruction[ 2 ],
            x: +instruction[ 3 ],
            y: +instruction[ 4 ]
        }
    }
    if ( type === 'A' ) {
        multiPoint( instruction, 8 )
        return {
            rx: +instruction[ 1 ],
            ry: +instruction[ 2 ],
            xrotate: +instruction[ 3 ],
            largearc: +instruction[ 4 ],
            sweep: +instruction[ 5 ],
            x: +instruction[ 6 ],
            y: +instruction[ 7 ]
        }
    }
    if ( type === 'C' ) {
        multiPoint( instruction, 7 )
        return {
            x1: +instruction[ 1 ],
            y1: +instruction[ 2 ],
            x2: +instruction[ 3 ],
            y2: +instruction[ 4 ],
            x: +instruction[ 5 ],
            y: +instruction[ 6 ]
        }
    }
    // need to support T https://github.com/jcblw/vsvg-paths/issues/3
    return {};
}

function filterNull ( n ) {
    return n
}

function trimEach( str ) {
    return str.trim()
}

module.exports.decode = function ( pathData ) {

    var instructions = pathData.match( eachInstPattern )
            .filter( filterNull )
            .filter( startsWithAlpha )
            .map( splitInstruction )
            .map( createPoint )

    return instructions

}
