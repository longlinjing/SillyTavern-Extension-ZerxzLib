import { LitElement, css, html } from 'lit';
import { CUSTOM_KEY, getSecrets, initGeminiModels, saveKey, STATE, throwGeminiError, } from '../utils';
import {
    updateSecretDisplay,
    writeSecret,
} from "@silly-tavern/scripts/secrets";
interface GeminiLayoutsOption {
    currentKey: string;
    lastKey: string;
    throwGeminiErrorState: boolean;
    switchKeyMakerSuite: boolean;
    apiKeys: string;
}
export class GeminiLayouts extends LitElement {
    static properties = {
        currentKey: { type: String, reflect: true },
        lastKey: { type: String, reflect: true },
        throwGeminiErrorState: { type: Boolean, reflect: true },
        switchKeyMakerSuite: { type: Boolean, reflect: true },
        apiKeys: { type: String, reflect: true }
    }
    declare currentKey: string;
    declare lastKey: string;
    declare throwGeminiErrorState: boolean;
    declare switchKeyMakerSuite: boolean;
    declare apiKeys: string;
    constructor(option: Partial<GeminiLayoutsOption> = {}) {

        super();
        const { currentKey, lastKey, throwGeminiErrorState, switchKeyMakerSuite, apiKeys } = Object.assign({
            currentKey: "",
            lastKey: "",
            throwGeminiErrorState: false,
            switchKeyMakerSuite: false,
            apiKeys: ""
        }, option);
        this.currentKey = currentKey;
        this.lastKey = lastKey;
        this.throwGeminiErrorState = throwGeminiErrorState;
        this.switchKeyMakerSuite = switchKeyMakerSuite;
        this.apiKeys = apiKeys;
    }
    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this;
    }

    render() {
        console.log('GeminiLayouts render');

        return html`
        <div>
            <h4>密钥调用信息:</h4>
            <div id="current_key_maker_suite">当前: ${this.currentKey}</div>
            <div id="last_key_maker_suite">最后: ${this.lastKey}</div>
            <div id="switch_key_maker_suite">密钥切换:${this.switchKeyMakerSuite ? "开" : "关"}</div>
            <div id="throw_gemini_error">报错开关:${this.throwGeminiErrorState ? "开" : "关"}</div>
        </div>
        <div class="flex-container flex">
            <h4>Google AI Studio API 多个密钥</h4>
            <textarea class="text_pole textarea_compact autoSetHeight" placeholder="API密钥"
            id="api_key_makersuite_custom" style="height: 100px;" @change=${this.handleTextareaInput} .value=${this.apiKeys}></textarea>
        </div>
        <div class="flex-container flex">
            <div class="menu_button menu_button_icon interactable" title="保存密钥" @click="${this.handleSaveKey}"><span>保存密钥</span></div>
            <div class="menu_button menu_button_icon interactable" title="获取新的模型" @click="${this.handleGetNewModel}"><span>获取新的模型</span></div>
            <div class="menu_button menu_button_icon interactable" title="切换密钥设置" @click="${this.handleSwitchKeyMakerSuite}"><span>切换密钥设置</span></div>
            <div class="menu_button menu_button_icon interactable" title="查看报错原因" @click="${this.handleThrowGeminiError}"><span>查看报错原因</span></div>
            <div class="menu_button menu_button_icon interactable" title="报错开关" @click="${this.handleSwitchGeminiError}"><span>报错开关</span></div>
        </div>
        <hr>
        `;
    }
    handleTextareaInput(event: Event) {
        console.log('handleTextareaInput', event);
        const textarea = event.target as HTMLTextAreaElement;

        const value = textarea.value
            .split(/[\n;]/)
            .map((v) => v.trim())
            .filter((v) => v.length > 0 && v.startsWith("AIzaSy"));

        this.apiKeys = value.join("\n");
        textarea.value = this.apiKeys;
        if (value.length === 0) {
            saveKey(CUSTOM_KEY, this.apiKeys);
            return;
        }
        const fistValue = value[0];
        writeSecret("api_key_makersuite", fistValue);
        saveKey(CUSTOM_KEY, this.apiKeys);
        // this.requestUpdate();
    }
    handleThrowGeminiError() {
        console.log('handleThrowGeminiError');
        throwGeminiError();
    }

    async handleGetNewModel() {
        console.log('handleGetNewModel');
        const secrets = await getSecrets();
        await initGeminiModels(secrets);
    }
    handleSaveKey() {
        console.log('handleSaveKey');
        const value = this.apiKeys
        if (value.length === 0) {
            saveKey(CUSTOM_KEY, value);
            return;
        }
        const fistValue = value[0];
        writeSecret("api_key_makersuite", fistValue);
        saveKey(CUSTOM_KEY, this.apiKeys);

    }
    handleSwitchKeyMakerSuite() {
        console.log('handleSwitchKeyMakerSuite');
        STATE.switchState = !STATE.switchState;
        localStorage.setItem("switch_key_maker_suite", STATE.switchState.toString());
        this.switchKeyMakerSuite = STATE.switchState;
    }
    handleSwitchGeminiError() {
        console.log('handleSwitchGeminiError');
        STATE.throwGeminiErrorState = !STATE.throwGeminiErrorState;
        localStorage.setItem("throw_gemini_error", STATE.throwGeminiErrorState.toString());
        this.throwGeminiErrorState = STATE.throwGeminiErrorState;
    }
}
customElements.define('gemini-layouts', GeminiLayouts);

