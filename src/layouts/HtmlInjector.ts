import { LitElement, html, css, type PropertyDeclarations } from 'lit';
import { ref, createRef } from 'lit/directives/ref.js';
import { SignalWatcher, signal } from '@lit-labs/signals';
import { type StyleInfo, styleMap } from 'lit/directives/style-map.js';
const isInjectionEnabled = signal(false);
const displayMode = signal(Number.parseInt(localStorage.getItem('displayMode') || '1'));
const lastMesTextContent = signal('');
const activationMode = signal(localStorage.getItem('activationMode') || 'all');
const customStartFloor = signal(Number.parseInt(localStorage.getItem('customStartFloor') || '1'));
const customEndFloor = signal(Number.parseInt(localStorage.getItem('customEndFloor') || '-1'));
const savedPosition = signal(localStorage.getItem('edgeControlsPosition') || 'top-right');
const isEdgeControlsCollapsed = signal<boolean>(JSON.parse(localStorage.getItem('isEdgeControlsCollapsed') || "true") as boolean || true);
const isVisibleSettingsPanel = signal<boolean>(JSON.parse(localStorage.getItem('isVisibleSettingsPanel') || "true") as boolean || true);
const saveTopPosition = signal(localStorage.getItem('saveTopPosition'));

class SettingsPanel extends SignalWatcher(LitElement) {
    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this;
    }
    public customFloorSettingsRef = createRef<HTMLDivElement>();
    public LastSettingsRef = createRef<HTMLDivElement>();
    declare edgeControls: EdgeControls
    render() {
        this.style.display = isVisibleSettingsPanel.get() ? 'none' : 'block';
        this.classList.add('drawer');
        return html`
        <div id="html-injector-settings-header" class="inline-drawer-header">
                <span class="inline-drawer-title">HTML注入器设置</span>
                <div id="html-injector-close-settings" class="inline-drawer-icon fa-solid fa-circle-xmark" @click=${this.toggleSettingsPanel}></div>
            </div>
            <div id="settings-content">
                <div class="settings-section">
                    <h3 class="settings-subtitle">边缘控制面板位置</h3>
                <select id="edge-controls-position" class="settings-select theme-element" @change=${this.handleSavePositionChange}>
                    <option value="top-right"            .selected=${savedPosition.get() === "top-right"}>界面右上角</option>
                    <option value="right-three-quarters" .selected=${savedPosition.get() === "right-three-quarters"}>界面右侧3/4位置</option>
                    <option value="right-middle"         .selected=${savedPosition.get() === "right-middle"}>界面右侧中间</option>
                    <option value="custom"               .selected=${savedPosition.get() === "custom"}>自定义位置</option>
                </select>
                </div>
                <div class="settings-section">
                <h3 class="settings-subtitle">显示模式</h3>
                <label class="settings-option"><input type="radio" name="display-mode" value="1" .checked=${displayMode.get() === 1} @change=${this.handleDisplayModeChange}> 原代码和注入效果一起显示</label>
                <label class="settings-option"><input type="radio" name="display-mode" value="2" .checked=${displayMode.get() === 2} @change=${this.handleDisplayModeChange}> 原代码以摘要形式显示</label>
                <label class="settings-option"><input type="radio" name="display-mode" value="3" .checked=${displayMode.get() === 3} @change=${this.handleDisplayModeChange}> 隐藏原代码，只显示注入效果</label>
            </div>
                <div class="settings-section">
                    <h3 class="settings-subtitle">激活楼层</h3>
                    <select id="activation-mode" class="settings-select theme-element" @change=${this.handleActivationModeChange} >
                        <option value="all" .selected=${activationMode.get() === "all"}>全部楼层</option>
                        <option value="first"  .selected=${activationMode.get() === "first"}>第一层</option>
                        <option value="last"   .selected=${activationMode.get() === "last"}>最后一层</option>
                        <option value="lastN"  .selected=${activationMode.get() === "lastN"}>最后N层</option>
                        <option value="custom" .selected=${activationMode.get() === "custom"}>自定义楼层</option>
                    </select>
                    <div id="custom-floor-settings" class="settings-subsection" style=${styleMap({
            display: activationMode.get() === 'custom' ? 'block' : 'none'
        })} ${ref(this.customFloorSettingsRef)}>
                        <label class="settings-option">起始楼层: <input type="number" id="custom-start-floor" min="1" value="1" @change=${this.handleCustomStartFloorChange}></label>
                        <label class="settings-option">结束楼层: <input type="number" id="custom-end-floor" min="-1" value="-1" @change=${this.handleCustomEndFloorChange}></label>
                        <p class="settings-note">（-1 表示最后一层）</p>
                    </div>
                    <div id="last-n-settings" class="settings-subsection" style=${styleMap({
            display: activationMode.get() === 'lastN' ? 'block' : 'none'
        })} ${ref(this.LastSettingsRef)} >
                        <label class="settings-option">最后 <input type="number" id="last-n-floors" min="1" value="1"  @change=${this.handleLastNFloorsChange}> 层</label>
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
    handleActivationModeChange(event: Event) {
        const target = event.target as HTMLSelectElement;
        const value = target.value;
        activationMode.set(value);
        localStorage.setItem('activationMode', value);
        this.updateInjection();
    }
    handleSavePositionChange(event: Event) {
        const target = event.target as HTMLSelectElement;
        const value = target.value;
        savedPosition.set(value);
        localStorage.setItem('edgeControlsPosition', value);
        this.edgeControls.updateEdgeControlsPosition(value);
    }
    handleCustomStartFloorChange(event: Event) {
        const target = event.target as HTMLInputElement;
        const value = Number.parseInt(target.value);
        customStartFloor.set(value);
        localStorage.setItem('customStartFloor', value.toString());
        this.updateInjection();
    }

    handleCustomEndFloorChange(event: Event) {
        const target = event.target as HTMLInputElement;
        const value = Number.parseInt(target.value);
        customEndFloor.set(value);
        localStorage.setItem('customEndFloor', value.toString());
        this.updateInjection();
    }
    handleLastNFloorsChange(event: Event) {
        const target = event.target as HTMLInputElement;
        const value = Number.parseInt(target.value);
        customEndFloor.set(value);
        localStorage.setItem('customEndFloor', value.toString());
        this.updateInjection();
    }
    handleDisplayModeChange(event: Event) {
        const target = event.target as HTMLInputElement;
        const value = Number.parseInt(target.value);
        displayMode.set(value);
        localStorage.setItem('displayMode', value.toString());
        this.updateInjection();
    }
    toggleSettingsPanel(event: Event) {
        const isVisible = this.style.display === 'block';
        this.style.display = isVisible ? 'none' : 'block';
        isVisibleSettingsPanel.set(isVisible);
        localStorage.setItem('isVisibleSettingsPanel', (!isVisible).toString());
    }
    updateInjection() {
        if (!isInjectionEnabled.get()) {
            return
        }
    }
}
class EdgeControls extends SignalWatcher(LitElement) {
    static properties: PropertyDeclarations = {
        settingsPanel: { type: Object },
        toggleEdgeButtonStyle: { type: Object },
        isDragging: { type: Boolean },
        startY: { type: Number },
        startTop: { type: Number },
        newTop: { type: Number }
    }
    public declare settingsPanel: SettingsPanel;
    public declare toggleEdgeButtonStyle: StyleInfo;
    public declare isDragging: boolean;
    public declare startY: number;
    public declare startTop: number;
    public newTop: number
    constructor() {
        super();
        this.toggleEdgeButtonStyle = {
            position: 'absolute',
            left: '-20px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'var(--SmartThemeBlurTintColor, rgba(22, 11, 18, 0.73))',
            color: 'var(--SmartThemeBodyColor, rgba(220, 220, 210, 1))',
            border: '1px solid var(--SmartThemeBorderColor, rgba(217, 90, 157, 0.5))',
            borderRadius: '5px 0 0 5px',
            cursor: 'pointer',
            padding: '5px',
            userSelect: 'none',
            fontSize: '12px',
            height: '60px',
        }
        this.isDragging = false;
        this.startY = 0;
        this.startTop = 0;
        this.newTop = 0;

    }
    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this;
    }
    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('mousemove', this.handleDragMove.bind(this));
        // @ts-ignore
        document.addEventListener('mouseup', this.handleDragEnd.bind(this));
        document.addEventListener('touchmove', this.handleDragMove.bind(this));
        // @ts-ignore
        document.addEventListener('touchend', this.handleDragEnd.bind(this));
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('mousemove', this.handleDragMove.bind(this));
        // @ts-ignore
        document.removeEventListener('mouseup', this.handleDragEnd.bind(this));
        document.removeEventListener('touchmove', this.handleDragMove.bind(this));
        // @ts-ignore
        document.removeEventListener('touchend', this.handleDragEnd.bind(this));
    }
    protected render(): unknown {
        // this.updateEdgeControlsPosition(savedPosition.get());
        return html`
            <div id="html-injector-drag-handle" @mousedown=${this.handleDragStart} @touchstart=${this.handleDragStart}>
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
                <input type="checkbox" id="edge-injection-toggle" @change=${this.handleToggleChange}>
                <span class="html-injector-slider"></span>
            </label>
            <button id="html-injector-toggle-panel" class="html-injector-button menu_button" @click=${this.toggleSettingsPanel}>${isVisibleSettingsPanel.get() ? "显示面板" : "隐藏面板"}</button>
            <button id="toggle-edge-controls" style=${styleMap(this.toggleEdgeButtonStyle)}
            @click=${this.handleToggleEdgeControls}
            >
            ${isEdgeControlsCollapsed.get() ? '<<' : '>>'}
            </button>
`
    }
    handleDragStart(e: DragEvent | MouseEvent | TouchEvent) {
        this.isDragging = true;
        this.startY = e.type.includes('mouse') ? (e as MouseEvent).clientY : (e as unknown as TouchEvent).touches[0].clientY;
        this.startTop = this.getBoundingClientRect().top;
        e.preventDefault();
    }
    handleDragMove(event: DragEvent | MouseEvent | TouchEvent) {
        if (!this.isDragging) {
            return;
        }
        const clientY = event.type.includes('mouse') ? (event as MouseEvent).clientY : (event as unknown as TouchEvent).touches[0].clientY;
        let newTop = this.startTop + (clientY - this.startY);
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - this.offsetHeight));
        this.newTop = newTop;
        this.style.top = `${newTop}px`;

    }
    handleDragEnd(event: DragEvent) {
        this.isDragging = false;
        if (activationMode.get() === 'custom') {
            saveTopPosition.set(this.newTop.toString());
            localStorage.setItem(
                "saveTopPosition",
                this.newTop.toString(),
            );
        }
    }



    handleToggleEdgeControls(event: Event) {
        isEdgeControlsCollapsed.set(!isEdgeControlsCollapsed.get());
        const value = isEdgeControlsCollapsed.get();
        this.style.right = value ? '-100px' : '0';
        localStorage.setItem('isEdgeControlsCollapsed', value.toString());
    }
    handleToggleChange(event: Event) {
        const target = event.target as HTMLInputElement;
        isInjectionEnabled.set(target.checked);
        if (isInjectionEnabled.get()) {

        } else {

        }

    }
    toggleSettingsPanel(event: Event) {
        this.settingsPanel.toggleSettingsPanel(event);
    }
    updatePosition() {
        this.updateEdgeControlsPosition(savedPosition.get());
    }
    updateEdgeControlsPosition(position: string) {
        switch (position) {
            case 'top-right':
                this.style.top = '20vh';
                this.style.transform = 'none';
                break;
            case 'right-three-quarters':
                this.style.top = '75vh';
                this.style.transform = 'none';
                break;
            case 'right-middle':
                this.style.top = '50%';
                this.style.transform = 'translateY(-50%)';
                break;
            case 'custom':
                this.style.top = saveTopPosition.get() ? `${saveTopPosition.get()}px` : "20vh";
                this.style.transform = 'none';
                break;
        }
        this.style.right = isEdgeControlsCollapsed.get() ? '-100px' : '0';
    }
}


customElements.define('settings-panel', SettingsPanel);
customElements.define('edge-controls', EdgeControls);
export function initInjector() {
    const settingsPanel = document.createElement('settings-panel') as SettingsPanel;
    const edgeControls = document.createElement('edge-controls') as EdgeControls;
    settingsPanel.id = 'html-injector-settings';
    edgeControls.id = 'html-injector-edge-controls';
    settingsPanel.edgeControls = edgeControls;
    edgeControls.settingsPanel = settingsPanel;
    document.body.appendChild(settingsPanel);
    document.body.appendChild(edgeControls);
    window.addEventListener("resize", () => {
        edgeControls.updatePosition();
    })
}
