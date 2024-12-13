import { LitElement, html, css, type PropertyDeclarations } from 'lit';
// class HtmlInjector extends LitElement {
//     static properties = {
//         isInjectionEnabled: { type: Boolean },
//         displayMode: { type: Number },
//         lastMesTextContent: { type: String },
//         activationMode: { type: String },
//         customStartFloor: { type: Number },
//         customEndFloor: { type: Number },
//         savedPosition: { type: String },
//         isEdgeControlsCollapsed: { type: Boolean },
//     };
//     declare isInjectionEnabled: boolean;
//     declare displayMode: number;
//     declare lastMesTextContent: string;
//     declare activationMode: string;
//     declare customStartFloor: number;
//     declare customEndFloor: number;
//     declare savedPosition: string;
//     declare isEdgeControlsCollapsed: boolean;
//     constructor() {
//         super();
//         this.isInjectionEnabled = false;
//         this.lastMesTextContent = '';
//         this.displayMode = Number.parseInt(localStorage.getItem('displayMode') || '1');
//         this.activationMode = localStorage.getItem('activationMode') || 'all';
//         this.customStartFloor = Number.parseInt(localStorage.getItem('customStartFloor') || '1');
//         this.customEndFloor = Number.parseInt(localStorage.getItem('customEndFloor') || '-1');
//         this.savedPosition = localStorage.getItem('edgeControlsPosition') || 'top-right';
//         this.isEdgeControlsCollapsed = localStorage.getItem('isEdgeControlsCollapsed') === 'true';
//     }
//     protected createRenderRoot(): HTMLElement | DocumentFragment {
//         return this;
//     }
//     render() {
//         console.log("HTMLInjector render");
//         console.log('HTMLInjector', this);
//         return html`
//             <settings-panel id="settings-panel" .displayMode=${this.displayMode} class="drawer" ></settings-panel>
//         `;
//     }

// }

class SettingsPanel extends LitElement {
    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this;
    }
    static properties = {
        displayMode: { type: Number }
    };
    declare displayMode: number;
    constructor() {
        super();
        this.displayMode = Number.parseInt(localStorage.getItem('displayMode') || '1');
    }
    render() {
        return html`
        <div id="html-injector-settings-header" class="inline-drawer-header">
                <span class="inline-drawer-title">HTML注入器设置</span>
                <div id="html-injector-close-settings" class="inline-drawer-icon fa-solid fa-circle-xmark"></div>
            </div>
            <div id="settings-content">
                <div class="settings-section">
                    <h3 class="settings-subtitle">边缘控制面板位置</h3>
                    <select id="edge-controls-position" class="settings-select theme-element">
                    <option value="top-right">界面右上角</option>
                    <option value="right-three-quarters">界面右侧3/4位置</option>
                    <option value="right-middle">界面右侧中间</option>
                </select>
                </div>
                <div class="settings-section">
                <h3 class="settings-subtitle">显示模式</h3>
                <label class="settings-option"><input type="radio" name="display-mode" value="1" ${this.displayMode === 1 ? 'checked' : ''}> 原代码和注入效果一起显示</label>
                <label class="settings-option"><input type="radio" name="display-mode" value="2" ${this.displayMode === 2 ? 'checked' : ''}> 原代码以摘要形式显示</label>
                <label class="settings-option"><input type="radio" name="display-mode" value="3" ${this.displayMode === 3 ? 'checked' : ''}> 隐藏原代码，只显示注入效果</label>
            </div>
                <div class="settings-section">
                    <h3 class="settings-subtitle">激活楼层</h3>
                    <select id="activation-mode" class="settings-select theme-element">
                        <option value="all">全部楼层</option>
                        <option value="first">第一层</option>
                        <option value="last">最后一层</option>
                        <option value="lastN">最后N层</option>
                        <option value="custom">自定义楼层</option>
                    </select>
                    <div id="custom-floor-settings" class="settings-subsection" style="display: none;">
                        <label class="settings-option">起始楼层: <input type="number" id="custom-start-floor" min="1" value="1"></label>
                        <label class="settings-option">结束楼层: <input type="number" id="custom-end-floor" min="-1" value="-1"></label>
                        <p class="settings-note">（-1 表示最后一层）</p>
                    </div>
                    <div id="last-n-settings" class="settings-subsection" style="display: none;">
                        <label class="settings-option">最后 <input type="number" id="last-n-floors" min="1" value="1"> 层</label>
                    </div>
                </div>
            </div>
            <div class="settings-footer">
                <p>安全提醒：请仅注入您信任的代码。不安全的代码可能会对您的系统造成潜在风险。</p>
                <p>注意：要注入的 HTML 代码应该用 \`\`\` 包裹，例如：</p>
                <pre class="code-example">
\`\`\`
&lt;h1&gt;Hello, World!&lt;/h1&gt;
&lt;p&gt;This is an example.&lt;/p&gt;
\`\`\`
        </pre>
        <p>以下是对应ST酒馆功能的特殊类名及简单的使用方法：</p>
        <pre class="code-example">
\`\`\`
&lt;button class="qr-button"&gt;(你的QR按钮名字)&lt;/button&gt;
&lt;textarea class="st-text"&gt;(对应酒馆的输入文本框，输入内容会同步到酒馆的文本框里)&lt;/textarea&gt;
&lt;button class="st-send-button"&gt;(对应酒馆的发送按钮)&lt;/button&gt;
\`\`\`
                </pre>
                <p>【注意】通过JavaScript动态插入st-text框的内容同步到st酒馆的输入框需要处理时间，如果需要同步，请添加一个小延迟来确保文本有时间进行同步.</p>
                <a href="https://discord.com/channels/1134557553011998840/1271783456690409554" target="_blank"> →Discord教程帖指路← 有详细说明与gal界面等模版 </a>
            </div>
        `
    }
}
class EdgeControls extends LitElement {
    static properties: PropertyDeclarations = {
        isEdgeControlsCollapsed: { type: Boolean },
        toggleButtonText: { type: String }
    }
    declare isEdgeControlsCollapsed: boolean;
    declare toggleButtonText: string;
    constructor() {
        super();
        this.isEdgeControlsCollapsed = localStorage.getItem('isEdgeControlsCollapsed') === 'true';
        this.toggleButtonText = this.isEdgeControlsCollapsed ? '<<' : '>>';
    }
    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this;
    }
    protected render(): unknown {
        const toggleEdgeControlsButton = html`
            <button id="toggle-edge-controls" style="
            position: absolute;
            left: -20px;
            top: 50%;
            transform: translateY(-50%);
            background-color: var(--SmartThemeBlurTintColor, rgba(22, 11, 18, 0.73));
            color: var(--SmartThemeBodyColor, rgba(220, 220, 210, 1));
            border: 1px solid var(--SmartThemeBorderColor, rgba(217, 90, 157, 0.5));
            border-radius: 5px 0 0 5px;
            cursor: pointer;
            padding: 5px;
            user-select: none;
            font-size: 12px;
            height: 60px;
            "
            @click=${this.handleToggleEdgeControls}
            >
            ${this.toggleButtonText}
            </button>
        `;
        return html`
            <div id="html-injector-drag-handle">
                <div class="drag-dots">
                ${Array.from({ length: 3 }).map(() => html`
                    <div style="display: flex; flex-direction: column; justify-content: space-between; height: 15px;">
                        ${Array.from({ length: 2 }).map(() => html`
                            <div style="width: 4px; height: 4px; border-radius: 50%; background-color: var(--smart-theme-body-color);"></div>
                        `)}
                    </div>
                `)}
                </div>
            </div>
            <label class="html-injector-switch">
                <input type="checkbox" id="edge-injection-toggle">
                <span class="html-injector-slider"></span>
            </label>
            <button id="html-injector-toggle-panel" class="html-injector-button menu_button">显示面板</button>
            ${toggleEdgeControlsButton}
`
    }
    handleToggleEdgeControls() {
        this.isEdgeControlsCollapsed = !this.isEdgeControlsCollapsed;
        this.style.right = this.isEdgeControlsCollapsed ? '-100px' : '0';
        this.toggleButtonText = this.isEdgeControlsCollapsed ? '<<' : '>>';
        localStorage.setItem('isEdgeControlsCollapsed', this.isEdgeControlsCollapsed.toString());
        this.requestUpdate();
    }
}




// customElements.define('html-injector', HtmlInjector);
customElements.define('settings-panel', SettingsPanel);
customElements.define('edge-controls', EdgeControls);

// export { HtmlInjector };
