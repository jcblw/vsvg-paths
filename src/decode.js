
'use strict';

var eachInstPattern = /(([a-z]+)(\s?\,?(\-?[0-9]+\.?[0-9]*))+)/gi,
    instPattern = /([a-z]+)|(\-?[0-9]+\.?[0-9]*)/gi,
    alphastart = /^[A-Z]/i,
    lengths = {
        V: 2,
        H: 2,
        L: 3,
        M: 3,
        S: 5,
        Q: 5,
        A: 8,
        C: 7
    }

function splitInstruction ( instruction ) {
    return instruction.match( instPattern );
}

function startsWithAlpha ( instruction ) {
    return alphastart.test( instruction )
}

function expandMultiPoints( accumulator, instruction ) {
    
    var instruct = instruction[ 0 ].toUpperCase(),
        length = lengths[ instruct ],
        next

    accumulator.push( instruction )
    if ( typeof length !== 'number' || instruction.length <= length ) {
        return
    }

    next = instruction.slice( length )
    next.unshift( instruction[0] ) // keeping same intructor

    expandMultiPoints( accumulator, next ) // get next point
}

function createPoint ( instruction ) {
    // console.log( instruction )
    var type = instruction[ 0 ].toUpperCase();
    if ( type === 'V' ) {
        return {
            y: +instruction[ 1 ]
        }
    }
    if ( type === 'H' ) {
        return {
            x: +instruction[ 1 ]
        }
    }
    if ( type === 'L' || type === 'M' ) {
        return {
            x : +instruction[ 1 ],
            y: +instruction[ 2 ]
        }
    }
    if ( type === 'S' ) {
        return {
            x2: +instruction[ 1 ],
            y2: +instruction[ 2 ],
            x: +instruction[ 3 ],
            y: +instruction[ 4 ]
        }
    }
    if ( type === 'Q' ) {
        return {
            x1: +instruction[ 1 ],
            y1: +instruction[ 2 ],
            x: +instruction[ 3 ],
            y: +instruction[ 4 ]
        }
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
        }
    }
    if ( type === 'C' ) {
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
    return {}
}

function filterNull ( n ) {
    return n
}

function trimEach( str ) {
    return str.trim()
}

/*
    Unfold this is the opposite of reduce, you can take an array with mutiple values
    and expands them to event more values
*/

function unfold( array, iterator ) {
    var accumulator = []
    array.forEach( iterator.bind( array, accumulator ) )
    return accumulator
}

module.exports.decode = function ( pathData ) {

    var instructions = pathData.match( eachInstPattern )
            .filter( startsWithAlpha )
            .map( splitInstruction )

    return unfold( instructions, expandMultiPoints )
            .map( createPoint )
}