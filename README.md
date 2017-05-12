# vsvg-paths ( virtual SVG path )  [![Build Status](https://travis-ci.org/jcblw/vsvg-paths.svg?branch=master)](https://travis-ci.org/jcblw/vsvg-paths)

[![Greenkeeper badge](https://badges.greenkeeper.io/jcblw/vsvg-paths.svg)](https://greenkeeper.io/)

vsvg path is a small lib to abstract the path data syntax for svgs into an json object. This help with manipulating points on the fly in javascript with ease. If you have an exsisting path data you can decode it into the structure as well.

# Install

    $ npm install vsvg-paths 

# Usage

## encode

Encode a array with objects, aka points, into path data for svg path d attributes. 

```javascript

var paths = require( 'vsvg-paths' ),
    path = document.getElementsByTagName( 'path' )[0],
    data = paths.encode( [
        {
            x: 0,
            y: 0
        },
        {
            x: 10,
            y: 10
        },
        {
            x: 1,
            y: 1,
            relative: true 
        }
    ]); // M0 0 L10 10 l1 1

path.setAttribute( 'd', data );
```

see [point types](#points-types) to see what point types are supported

## decode

Decode an existing set of path data into the JSON tree that you can pass to encode.

```javascript

var paths = require( 'vsvg-paths' ),
    path = 'M0 0 L10 10 l1 1',
    data = paths.decode( path )

console.log( data ) 
/*  
    [
        {
            x: 0,
            y: 0
        },
        {
            x: 10,
            y: 10
        },
        {
            x: 1,
            y: 1,
            rel: true // same as relative: true
        }
    ]
*/
```

### Points types

Very closely based off of [Path Data Spec](http://www.w3.org/TR/SVG/paths.html#PathData). Please referance there for more specifics of what points represent. Also if the key `rel` or `relative` is set to true the path with encoded with a lower case instruction making the point relative to the last point.

- Move To: The first point in an array of points that has only a x and y value eg.
```json
{
    "x": 0,
    "y": 0
}
```
- Line To: A point that is not the first of the array that has only a x and y value eg.
```json
{
    "x": 100,
    "y": 50
}
```
- Horizontal Line: a point that only has an x value eg.
```json
{
    "x": 100
}
```
- Vertical Line: a point that only has an y value eg.
```json
{
    "y": 150
}
```
- Curve To: A point that has a x1, y1, x2, y2, x, and y value eg.
```json
{
    "x1": 500,
    "y1": 500,
    "x2": 250,
    "y2": 250,
    "x": 100,
    "y": 50
}
```
- Curve Sorthand: A point that has a x2, y2, x, and y also must for a full curve to point eg.
```json
{
    "x2": 250,
    "y2": 250,
    "x": 100,
    "y": 50
}
```
- Quadratic Bézier Curve To: a point that has a x1, y1, x, and y value. eg
```json
{
    "x1": 250,
    "y1": 250,
    "x": 100,
    "y": 50
}
```
- Elliptical Arc: a point that has a rx, ry, xrotate, largearc, sweep, x, and y value. eg.
```json
{
    "rx": 25,
    "ry": 25,
    "xrotate": -30,
    "largearc": 0,
    "sweep": 1,
    "x": 250,
    "y": 250
}
```
- Close Path
```json
{}
```
# What this needs

- shorthand quadratic Bézier 
- decoder
- support for absolute and relative positioning in same path
