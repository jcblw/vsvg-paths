var test = require( 'tape' ),
    decode = require( '../src/decode' );

test( 'testing decode::_splitInstruction', function( t ) {
    var foo = 'm 0 1',
        bar = 'c-2.3,23,-25 0'

    t.equals( typeof decode._splitInstruction, 'function', '_splitInstruction should be a function' )
    t.throws( decode._splitInstruction, 'If not string is passed in as first argument _splitInstruction will throw' )
    t.equals( Array.isArray( decode._splitInstruction( foo ) ), true, '_splitInstruction should return an array' )
    t.equals( decode._splitInstruction( foo ).length, 3, '_splitInstruction will break apart path data instruction into the right amount of parts' ) 
    t.equals( decode._splitInstruction( foo )[ 0 ], 'm', '_splitInstruction will break apart path data the first item in array will be the letter "m"' )
    t.equals( decode._splitInstruction( foo )[ 1 ], '0', '_splitInstruction will break apart path data the second item in array will be the letter "0" as a string' )
    t.equals( decode._splitInstruction( foo )[ 2 ], '1', '_splitInstruction will break apart path data the thid item in array will be the letter "1" as a string' )
    t.equals( decode._splitInstruction( bar ).length, 5, '_splitInstruction will break apart path data instruction into the right amount of parts even when special chars "-.," are used' ) 
    t.equals( decode._splitInstruction( bar )[ 0 ], 'c', '_splitInstruction will break apart path data the first item in array will be the letter "c"' )
    t.equals( decode._splitInstruction( bar )[ 1 ], '-2.3', '_splitInstruction will break apart path data the second item in array will be the letter "-2.3" as a string' )
    t.equals( decode._splitInstruction( bar )[ 2 ], '23', '_splitInstruction will break apart path data the thid item in array will be the letter "23" as a string' )
    // we can test the the value but most test cases are achieved
    t.end()
} )

test( 'testing decode::_unfold', function( t ) {
    var foo = ['a', 'b:c', 'd']

    function iterator( accumulator, value, index ) {
        t.equals( Array.isArray( accumulator ), true, 'Accumulator is an array' )
        t.equals( value, foo[ index ], 'Index ' + index + ' is the correct value' )
        if ( value.indexOf( ':' ) !== -1 ) {
            value.split( ':' ).forEach( function( x ) { 
                accumulator.push( x )        
            } )
            return
        }
        accumulator.push( value )
    }

    t.equals( typeof decode._unfold, 'function', '_unfold is a function' )
    t.throws( decode._unfold, 'when passing in no arguments to _unfold the function will throw' )

    t.equals( Array.isArray( decode._unfold( foo, iterator ) ), true, '_unfold will return an array' )
    t.equals( decode._unfold( foo, iterator ).length, 4, 'the correct amount in array was returned from unfold' )
    t.equals( decode._unfold( foo, iterator )[2], 'c', 'the value of the unfolded value is in the correct position' ) 

    t.end()
} )

test( 'testing decode::_expandMultiPoints', function( t ) {
    var foo = ['m', '0', '0', '10', '10'],
        bar = []

    t.equals( typeof decode._expandMultiPoints, 'function', '_expandMultiPoints is a function' )
    t.throws( decode._expandMultiPoints, 'when no input is passed to _expandMultiPoints it throws' )

    decode._expandMultiPoints( bar, foo )

    t.equals( bar.length, 2, 'when passing an array to the first argument and a pathData array that has multiple points in it into the second argument it will expand the path into two arrays and push them into the array' )
    t.equals( Array.isArray( bar[ 0 ] ), true, 'the values that are pushed into the array are arrays as well' )
    t.equals( bar[0][0], 'm', 'the correct value is at the start of the first array in the array of arrays' )
    t.equals( bar[1][0], 'm', 'the correct value is at the start of the second array in the array of arrays' )
    // can probably expand on this test
    t.end()
} )

test( 'testing decode::_createPoint', function( t ) {
    var m = ['M', '0', '0'],
        l = ['l', '0', '0'],
        v = ['v', '0'],
        h = ['h', '0'],
        s = ['s', '0', '0', '0', '0'],
        q = ['q', '0', '0', '0', '0'],
        a = ['a', '0', '0', '0', '0', '0', '0', '0'],
        c = ['c', '0', '0', '0', '0', '0', '0'],
        m2 = [ 'm', 0, 0, 0, 0, 0]


    t.equals( typeof decode._createPoint, 'function', '_createPoint is a function' )
    t.throws( decode._createPoint, 'if no input is given to _createPoint it will throw' )    
    t.equals( typeof decode._createPoint( m ), 'object', '_createPoint will return an object' )
    t.equals( Object.keys( decode._createPoint( m ) ).length, 3, '_createPoint will return an object that has the right amount of keys for a "m" point' )
    t.equals( Object.keys( decode._createPoint( l ) ).length, 3, '_createPoint will return an object that has the right amount of keys for a "l" point' )
    t.equals( Object.keys( decode._createPoint( v ) ).length, 2, '_createPoint will return an object that has the right amount of keys for a "v" point' )
    t.equals( Object.keys( decode._createPoint( h ) ).length, 2, '_createPoint will return an object that has the right amount of keys for a "h" point' )
    t.equals( Object.keys( decode._createPoint( s ) ).length, 5, '_createPoint will return an object that has the right amount of keys for a "s" point' )
    t.equals( Object.keys( decode._createPoint( q ) ).length, 5, '_createPoint will return an object that has the right amount of keys for a "q" point' )
    t.equals( Object.keys( decode._createPoint( a ) ).length, 8, '_createPoint will return an object that has the right amount of keys for a "a" point' )
    t.equals( Object.keys( decode._createPoint( c ) ).length, 7, '_createPoint will return an object that has the right amount of keys for a "c" point' )
    t.equals( Object.keys( decode._createPoint( m2 ) ).length, 3, '_createPoint will return an object that has the right amount of keys for a point and will ignore extra items in array' )
    t.equals( typeof decode._createPoint( m ).x , 'number', '_createPoint will return an object that has key values that are type casted to a number' )

    t.end()
} )

test( 'testing decode::decode', function( t ) {

    var foo = 'M5 5 L100 200 C100 100 250 100 250 200 S400 300 400 200 H500 V100 A25 25 -30 0 1 250 250 Q100 300 25 250 Z',
        bar = 'm 234.28571,580.9336 -4.66385,-82.33095 -70.46629,-42.83271 76.86019,-29.87725 18.96104,-80.25346 52.16606,63.8658 82.18486,-6.76666 -44.61979,69.34849 31.83199,76.07143 -79.7426,-21.00608 z'

    t.equals( typeof decode.decode, 'function', 'decode is a function' )
    t.throws( decode.decode, 'if no arguments are passed to decode it will throw' )
    t.equals( Array.isArray( decode.decode( foo ) ), true, 'decode will return an array' )
    t.equals( typeof decode.decode( foo )[0], 'object', 'decode will return an array of points' )
    t.equals( decode.decode( foo ).length, 9, 'decode will return an array with the correct amount of points' )
    t.equals( decode.decode( bar ).length, 11, 'decode will return an array with the correct amount of points even when using multi points and or commas' )
    t.deepEquals( decode.decode( bar )[ decode.decode( bar ).length - 1 ], {}, 'decode will return the correct items in the array' )
    t.end()    
} );