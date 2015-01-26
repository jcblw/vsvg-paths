
var decode = require( '..' ).decode,
    pathData = 'M5 5 L100 200 C100 100 250 100 250 200 S400 300 400 200 H500 V100 A25 25 -30 0 1 250 250 Q100 300 25 250 Z';

console.log(decode( pathData ));
