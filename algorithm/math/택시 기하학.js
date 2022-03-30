const r = +require('fs').readFileSync('/dev/stdin').toString()
console.log((r**2*3.141592653589793238462643).toFixed(6))
console.log(((Math.sqrt(2)*r)**2).toFixed(6))