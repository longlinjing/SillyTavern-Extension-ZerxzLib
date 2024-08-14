
async function importFromScript(path: string) {
    const root = "../../../../../";
    return await import(/* webpackIgnore: true */ root + path) ;
}
console.log("Hello from SillyTavern-Extension-ZerxzLib!")
console.log("Importing from SillyTavern-Extension-ZerxzLib/src/index.ts")

async  function init(){
    console.log("init");
    const script = await importFromScript("script.js")
    console.log(script);
    const {getContext} = await importFromScript("script/extensions.js")
    console.log(getContext());
}
init();

