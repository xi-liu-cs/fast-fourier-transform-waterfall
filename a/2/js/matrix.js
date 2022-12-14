let matrixIdentity = () => [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];

let matrixInverse = function(src) {
  let dst = [], det = 0, cofactor = (c, r) => {
     let s = (i, j) => src[c+i & 3 | (r+j & 3) << 2];
     return (c+r & 1 ? -1 : 1) * ( (s(1,1) * (s(2,2) * s(3,3) - s(3,2) * s(2,3)))
                                 - (s(2,1) * (s(1,2) * s(3,3) - s(3,2) * s(1,3)))
                                 + (s(3,1) * (s(1,2) * s(2,3) - s(2,2) * s(1,3))) );
  }
  for (let n = 0 ; n < 16 ; n++) dst.push(cofactor(n >> 2, n & 3));
  for (let n = 0 ; n <  4 ; n++) det += src[n] * dst[n << 2];
  for (let n = 0 ; n < 16 ; n++) dst[n] /= det;
  return dst;
}

let matrixMultiply = function(a, b) {
   let dst = [];
   for (let n = 0 ; n < 16 ; n++)
      dst.push( a[n&3     ] * b[n&12    ] +
                a[n&3 |  4] * b[n&12 | 1] +
                a[n&3 |  8] * b[n&12 | 2] +
                a[n&3 | 12] * b[n&12 | 3] );
   return dst;
}

let matrixRotx = t => {
   let c = Math.cos(t), s = Math.sin(t);
   return [1,0,0,0, 0,c,s,0, 0,-s,c,0, 0,0,0,1];
}

let matrixRoty = t => {
   let c = Math.cos(t), s = Math.sin(t);
   return [c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1];
}

let matrixRotz = t => {
   let c = Math.cos(t), s = Math.sin(t);
   return [c,s,0,0, -s,c,0,0, 0,0,1,0, 0,0,0,1];
}

let matrixScale = (x,y,z) => {
   if (Array.isArray(x)) {
      z = x[2];
      y = x[1];
      x = x[0];
   }
   else if (y === undefined)
      y = z = x;
   return [x,0,0,0, 0,y,0,0, 0,0,z,0, 0,0,0,1];
}

matrixTransform = function(m, p) {
   let x = p[0], y = p[1], z = p[2], w = p[3] === undefined ? 1 : p[3];
   return [
      m[0] * x + m[4] * y + m[ 8] * z + m[12] * w,
      m[1] * x + m[5] * y + m[ 9] * z + m[13] * w,
      m[2] * x + m[6] * y + m[10] * z + m[14] * w,
      m[3] * x + m[7] * y + m[11] * z + m[15] * w
   ]
}

let matrixTranslate = (x,y,z) => {
   if (Array.isArray(x)) {
      z = x[2];
      y = x[1];
      x = x[0];
   }
   return [1,0,0,0, 0,1,0,0, 0,0,1,0, x,y,z,1];
}

let matrixTranspose = function(m) {
   return [ m[0],m[4],m[ 8],m[12],
            m[1],m[5],m[ 9],m[13],
            m[2],m[6],m[10],m[14],
            m[3],m[7],m[11],m[15] ];
}

let mTranslate = (x,y,z, M) => matrixMultiply(M, matrixTranslate(x,y,z));
let mRotx      = (theta, M) => matrixMultiply(M, matrixRotx(theta));
let mRoty      = (theta, M) => matrixMultiply(M, matrixRoty(theta));
let mRotz      = (theta, M) => matrixMultiply(M, matrixRotz(theta));
let mScale     = (x,y,z, M) => matrixMultiply(M, matrixScale(x,y,z));

let Matrix = function() {
   let stack = [ matrixIdentity() ];
   let top = 0;
   let m = () => stack[top];

   this.get = () => m();
   this.set = src => stack[top] = src;
   this.identity  = ()      => this.set(matrixIdentity());
   this.translate = (x,y,z) => this.set(matrixMultiply(m(), matrixTranslate(x,y,z)));
   this.scale     = (x,y,z) => this.set(matrixMultiply(m(), matrixScale(x,y,z)));
   this.rotx      = theta   => this.set(matrixMultiply(m(), matrixRotx(theta)));
   this.roty      = theta   => this.set(matrixMultiply(m(), matrixRoty(theta)));
   this.rotz      = theta   => this.set(matrixMultiply(m(), matrixRotz(theta)));
   this.transform = p => this.set(matrixTransform(m(), p));
   this.save = () => {
      stack[top+1] = stack[top].slice();
      top++;
   }
   this.restore = () => {
      if (top == 0)
         console.log('empty matrix stack!');
      else
         top--;
   }
}
