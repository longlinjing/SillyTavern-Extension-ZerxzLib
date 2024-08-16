import * as lib from './lib.js';
for(let key in lib) {
  console.log(key);
  console.log(lib[key]);
  lib[key]();
}
