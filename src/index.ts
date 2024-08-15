import { getEntitiesList } from '@silly-tavern/script.js';
import Sandbox from '@nyariv/sandboxjs';
const impotModule = new Map<string, object>();
async function importFromScript(path: string): Promise<unknown> {
    if (impotModule.has(path)) {
        return impotModule.get(path);
    }
    path = `/${path}`;
    const what = await import(/* webpackIgnore: true */ path);
    impotModule.set(path, what);
    return what;
}

console.log('Hello from SillyTavern-Extension-ZerxzLib!');
console.log('Importing from SillyTavern-Extension-ZerxzLib/src/index.ts');
console.log(getEntitiesList());
console.log(new Sandbox());
async function init() {
    console.log('init');
    const script = await importFromScript('script.js');
    console.log(script);
    const { getContext } = await importFromScript('@silly-tavern/extensions') as { getContext: () => any };
    console.log(getContext());
}
init();

