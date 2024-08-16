import * as lib from './lib.js';
for(const key in lib) {
    console.log(key);
    console.log(lib[key]);
    const value = lib[key];
    if (typeof value === 'function')value()
    else if (typeof value === 'object') {
        typeof value.default == 'function' && value.default();
    }
}
