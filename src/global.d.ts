// eslint-disable-next-line no-var
declare var SillyTavern: {
    getContext: any;
};

declare module '@silly-tavern/script.js' {
    export const eventSource: any;
    export const event_types: Record<string, string>;
}
