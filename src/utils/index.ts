
const impotModule = new Map<string, object>();
export async function importFromScript(path: string): Promise<unknown> {
    if (impotModule.has(path)) {
        return impotModule.get(path);
    }
    path = `/${path}`;
    const what = await import(/* webpackIgnore: true */ path);
    impotModule.set(path, what);
    return what;
}
