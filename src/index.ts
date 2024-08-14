const impotModule = new Map<string, any>();
async function importFromScript(path: string) {
    if (impotModule.has(path)) {
        return impotModule.get(path);
    }
    const what =await  import(/* webpackIgnore: true */"/" + path)
    impotModule.set(path, what);
    return what;
}
console.log("Hello from SillyTavern-Extension-ZerxzLib!")
console.log("Importing from SillyTavern-Extension-ZerxzLib/src/index.ts")

async function init() {
    console.log("init");
    const script = await importFromScript("script.js")
    console.log(script);
    const { getContext } = await importFromScript("script/extensions.js")
    console.log(getContext());
}
init();

