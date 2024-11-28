import {eventSource, event_types, saveSettingsDebounced, getRequestHeaders, callPopup } from '@silly-tavern/script';
import {extension_settings, getContext, loadExtensionSetting} from '@silly-tavern/scripts/extensions';
import { secret_state, updateSecretDisplay, writeSecret } from '@silly-tavern/scripts/secrets';
const extensionName = "SillyTavern-Extension-ZerxzLib";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;
const extensionSettings = extension_settings[extensionName];
const defaultSettings = {};
export default async function init() {
console.log("ZerxzLib init");
}


JQuery(async () => {
    await init();
    console.log("ZerxzLib loaded");
}  );
