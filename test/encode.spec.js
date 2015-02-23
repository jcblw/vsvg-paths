var test = require( 'tape' ),
    encode = require( '../src/encode' )

test( 'testing encode::_keyValueArray', function( t ) {
    var values = { foo: 'bar'},
        keyVals = encode._keyValueArray( values )

    t.equals( Array.isArray(keyVals), true, 'keyValueArray returns an array' )
    t.equals( keyVals.length, 1, 'the correct number of items are in the returned array' )
    t.equals( Array.isArray(keyVals[0]), true, 'the first item in the array is an array' )
    t.equals( keyVals[0].length, 2, 'the correct number of items are in the returned arrays first item' )
    t.equals( keyVals[0][0], 'foo', 'the first item in the first array of the returned array is the inputed key' )
    t.equals( keyVals[0][1], 'bar', 'the second item int the first array of the returned array is the input value of the first key' )
    t.end()
} )

test( 'testing encode::_getValue', function( t ) {
    t.equals( typeof encode._getValue(), 'function', ' the return of _getValue is a function' )
    t.equals( encode._getValue( 'foo' )( [ null, 'bar' ], 0 ), 'foobar', 'if second argument of returned function is falsey the first argument of _getValue will be append to the second item in the first arugment (Array) of the returned function' )
    t.equals( encode._getValue( 'foo' )( [ null, 'bar' ], 1 ), 'bar', 'if second argument of returned function is truthy the first argument of _getValue will not be append to the second item in the first arugment (Array) of the returned function' )
    t.end()
})

test( 'testing encode::_sortValue', function( t ) {
    t.equals( encode._sortValue( ['x'], ['y'] ), -1, 'when two arrays are passed into _sortValue that have a valid first key it will minus the value of the second array against the first array' )
    t.equals( encode._sortValue( ['y'], ['x'] ), 1, 'when two arrays are passed into _sortValue that have a valid first key it will minus the value of the second array against the first array' )
    t.end()
})

test( 'testing encode::_sortPoints', function( t ) {
    var points = [['y'],['x1'],['ry'],['y2'],['rx'],['x2'],['xrotate'],['y1'],['largearc'],['x'],['sweep']]
        sorted = encode._sortPoints( points )
    // for pattern expected see line:3 of src/encode.js
    t.equals( sorted[0][0], 'x1', 'when sorted x1 value is correct placement' )
    t.equals( sorted[1][0], 'y1', 'when sorted y1 value is correct placement' )
    t.equals( sorted[2][0], 'x2', 'when sorted x2 value is correct placement' )
    t.equals( sorted[3][0], 'y2', 'when sorted y2 value is correct placement' )
    t.equals( sorted[4][0], 'rx', 'when sorted rx value is correct placement' )
    t.equals( sorted[5][0], 'ry', 'when sorted ry value is correct placement' )
    t.equals( sorted[6][0], 'xrotate', 'when sorted xrotate value is correct placement' )
    t.equals( sorted[7][0], 'largearc', 'when sorted largearc value is correct placement' )
    t.equals( sorted[8][0], 'sweep', 'when sorted sweep value is correct placement' )
    t.equals( sorted[9][0], 'x', 'when sorted x value is correct placement' )
    t.equals( sorted[10][0], 'y', 'when sorted y value is correct placement' )
    t.end()
})

test( 'testing encode::_stringifyPoints', function( t ) {
    t.equals( typeof encode._stringifyPoints(), 'function', '_stingifyPoints should return a function' )
    
    var inst = [ 'foo', 'bar' ],
        point = [['bar', 'baz'],['qux', 'xar']],
        emptyPoint = [],
        stringPoint = encode._stringifyPoints( inst )( point, 1 )
        stringPointEmpty = encode._stringifyPoints( inst )( emptyPoint, 0 )

    t.equals( typeof stringPoint, 'string', 'the return of the returned function of string points is a string' )
    t.equals( stringPoint, 'barbaz xar', 'the string return is compiled of the value ( base of index passed in as second argument of returned function ) from the first array passed into the initial function and the the second value of each item in the collection passed into the first argument of the returned array' )
    t.equals( stringPointEmpty, 'foo', 'the string that is returned to the returned function when an empty array is given is just the instruction ( based off index passed in as second argument of returned function )' )
    t.end()
})


test( 'testing encode::_isValid', function( t ){
    t.equals( encode._isValid( 0 ), true, 'passing zero _isValid will return a true' )
    t.equals( encode._isValid( 1 ), 1, 'passing a truthy value will return a that same value back' )
    t.equals( encode._isValid( null ), false, 'when passing a null value _isValid will return false' )
    t.equals( encode._isValid( NaN ), false, 'when passing NaN _isValid will return false' )
    t.end()
})

test( 'testing encode::_getInstruction', function( t ) {
    t.equals( encode._getInstruction({x2:0,y2:0,x1:0,y1:0}), 'C', 'when passing in a point with a x2,y2,x1,y1 keys string "C" will be returned' ) 
    t.equals( encode._getInstruction({rx:0,ry:0}), 'A', 'when passing in a point with a rx,ry keys string "A" will be returned' ) 
    t.equals( encode._getInstruction({x1:0,y1:0}), 'Q', 'when passing in a point with a x1,y1 keys string "Q" will be returned' ) 
    t.equals( encode._getInstruction({x2:0,y2:0}), 'S', 'when passing in a point with a x2,y2 keys string "S" will be returned' ) 
    t.equals( encode._getInstruction({x:0,y:0}), 'M', 'when passing in a point with a x,y keys and a falsey second argument the string "M" will be returned' ) 
    t.equals( encode._getInstruction({x:0,y:0}, true), 'L', 'when passing in a point with a x,y keys and a truthy second argument the string "L" will be returned' ) 
    t.equals( encode._getInstruction({x:0}), 'H', 'when passing in a point with a x key the string "H" will be returned' ) 
    t.equals( encode._getInstruction({y:0}), 'V', 'when passing in a point with a y key the string "V" will be returned' ) 
    t.equals( encode._getInstruction({}), 'Z', 'when passing in a point with no keys the string "Z" will be returned' )
    t.end()
} )

test( 'testing encode::encode', function( t ) {
    var path = [ 
        { x: 5, y: 5 }, // moveto
        { x: 100, y: 200 }, // lineto
        { x1: 100 , y1: 100, x2: 250, y2: 100, x: 250, y: 200 }, // curveto
        { x2: 400, y2: 300, x: 400, y: 200 }, // shorthand curve
        { x: 500 }, // horizontal line
        { y: 100 }, // vertical line
        { // elliptical arc
            rx: 25,
            ry: 25,
            xrotate: -30,
            largearc: 0,
            sweep: 1,
            x: 250,
            y: 250
        },
        { x1: 100, y1: 300, x: 25, y: 250 }, // quadratic Bézier 
        {}
    ],
    relPath = [ 
        { x: 5, y: 5, rel: true }, // moveto
        { x: 100, y: 200, rel: true }, // lineto
        { x1: 100 , y1: 100, x2: 250, y2: 100, x: 250, y: 200, rel: true }, // curveto
        { x2: 400, y2: 300, x: 400, y: 200, rel: true }, // shorthand curve
        { x: 500, rel: true }, // horizontal line
        { y: 100, rel: true }, // vertical line
        { // elliptical arc
            rx: 25,
            ry: 25,
            xrotate: -30,
            largearc: 0,
            sweep: 1,
            x: 250,
            y: 250,
            rel: true 
        },
        { x1: 100, y1: 300, x: 25, y: 250, rel: true }, // quadratic Bézier 
        { rel: true }
    ]
    t.equals( encode.encode(), undefined, 'if a non array argument is passed into the first parameter of encode undefined will be returned' )
    t.equals( encode.encode( path ), 'M5 5 L100 200 C100 100 250 100 250 200 S400 300 400 200 H500 V100 A25 25 -30 0 1 250 250 Q100 300 25 250 Z', 'the correct path is outputed' )
    t.equals( encode.encode( relPath ), 'm5 5 l100 200 c100 100 250 100 250 200 s400 300 400 200 h500 v100 a25 25 -30 0 1 250 250 q100 300 25 250 z', 'the correct path is outputed, with lowercase instructions for relative positioning' )
    t.end()
})
