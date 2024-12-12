import {
	eventSource,
	event_types,
	saveSettingsDebounced,
	getRequestHeaders,
	callPopup,
} from "@silly-tavern/script";
import {
	extension_settings,
	getContext,
	loadExtensionSetting,
} from "@silly-tavern/scripts/extensions";
import {
	secret_state,
	updateSecretDisplay,
	writeSecret,
} from "@silly-tavern/scripts/secrets";
import { oai_settings } from "@silly-tavern/scripts/openai";
import { getGeminiModel, isGeminiSource, throwGeminiError } from "utils/index";
import { callGenericPopup, POPUP_TYPE } from "@silly-tavern/scripts/popup";
let switchState = localStorage.getItem("switch_key_maker_suite") === "true";
interface Model {
	name: string;
	model: string;
}
export default async function init(secrets: Record<string, string>) {
	if (!secrets) {
		return;
	}
	const modelStr = JSON.parse(secrets.models_makersuite ?? "[]") as Model[];
	const api_key = secrets.api_key_makersuite ?? "";
	console.log("ZerxzLib init");
	const optgroup = $("#model_google_select > optgroup");
	console.log("optgroup", optgroup);
	const primaryVersions = optgroup[0];
	const subVersions = optgroup[1];
	console.log("subVersions", subVersions);
	const subVersionsArray = Array.from(
		subVersions.children,
	) as HTMLOptionElement[];
	const primaryVersionsArray = Array.from(
		primaryVersions.children,
	) as HTMLOptionElement[];
	console.log("subVersionsArray", subVersionsArray);
	const subVersionsValues = subVersionsArray.map((el) => el.value);
	const primaryVersionsValues = primaryVersionsArray.map((el) => el.value);
	const originalVersions = [
		...primaryVersionsValues,
		...subVersionsValues,
	].flat();
	const cachedVersions = modelStr.map((model) => model.model);
	// 判断是否初次加载
	if (modelStr.length > 0) {
		for (const model of modelStr) {
			if (originalVersions.includes(model.model)) {
				continue;
			}
			const option = document.createElement("option");
			option.value = model.model;
			option.text = `${model.name}(${model.model})`;
			subVersions.appendChild(option);
		}
	}
	const geminiModels = await getGeminiModel(api_key);
	console.log("geminiModels", geminiModels);
	const geminiModelOptions = geminiModels.filter(
		(model) =>
			!originalVersions.includes(model.model) &&
			!cachedVersions.includes(model.model),
	);

	if (geminiModelOptions.length === 0) {
		console.log("没有新的模型");
	} else {
		console.log("geminiModelOptions", geminiModelOptions);
		for (const model of geminiModelOptions) {
			const option = document.createElement("option");
			option.value = model.model;
			option.text = `${model.name}(${model.model})`;
			subVersions.appendChild(option);
		}
		saveKey("models_makersuite", JSON.stringify(geminiModelOptions));
	}
	const uniqueModels = new Set([...originalVersions, ...cachedVersions, ...geminiModelOptions.map((model) => model.model)]);
	if (GOOGLE_SOURCES.includes(oai_settings.chat_completion_source) && !!secrets.api_key_makersuite_model) {
		if (!uniqueModels.has(secrets.api_key_makersuite_model)) {
			return
		}
		oai_settings.google_model = secrets.api_key_makersuite_model;
		$('#model_google_select').val(oai_settings.google_model);
		$(`#model_google_select option[value="${oai_settings.google_model}"`).attr('selected', true);
	}

}

const key = "api_key_makersuite_custom";
async function getSecrets() {
	const response = await fetch("/api/secrets/view", {
		method: "POST",
		headers: getRequestHeaders(),
	});

	if (response.status === 403) {
		callPopup(
			"<h3>禁止访问</h3><p>要在此处查看您的 API 密钥，请在 config.yaml 文件中将 allowKeysExposure 的值设置为 true，然后重新启动 SillyTavern 服务器。</p>",
			"text",
		);
		return;
	}

	if (!response.ok) {
		return;
	}

	// $("#dialogue_popup").addClass("wide_dialogue_popup");
	const data = (await response.json()) as Record<string, string>;
	// console.log("data", data);
	return data;
}
async function createButton(title: string, onClick: () => void) {
	const div = document.createElement("div");
	div.classList.add("menu_button", "menu_button_icon", "interactable");
	div.title = title;
	div.onclick = onClick;
	const span = document.createElement("span");
	span.textContent = title;
	div.appendChild(span);
	return div;
}
async function switchSecretsFromArray(generationType, _args, isDryRun) {
	const secrets = await getSecrets();
	if (!secrets) {
		return;
	}
	if (!switchState) {
		return;
	}
	const api_key = secrets[key] ?? "";
	const api_keys = api_key
		.split(/[\n;]/)
		.map((v) => v.trim())
		.filter((v) => v.startsWith("AIzaSy"));
	if (api_keys.length <= 1) {
		return;
	}
	const currentKey = secrets.api_key_makersuite;
	let firstKeyApi = "";
	if (api_keys.includes(currentKey)) {
		api_keys.splice(api_keys.indexOf(currentKey), 1);
		api_keys.push(currentKey);
	}
	firstKeyApi = api_keys[0];
	writeSecret("api_key_makersuite", firstKeyApi);
	saveKey(key, api_keys.join("\n"));
	const textarea = $("#api_key_makersuite_custom")[0] as HTMLTextAreaElement;

	const currentKeyElement = $("#current_key_maker_suite")[0] as HTMLSpanElement;
	const lastKeyElement = $("#last_key_maker_suite")[0] as HTMLSpanElement;
	console.log("textarea", textarea);
	console.log("api_keys", api_keys);
	if (!textarea) {
		return;
	}
	currentKeyElement.textContent = `当前密钥: ${firstKeyApi}`;
	lastKeyElement.textContent = `最后一个密钥: ${currentKey}`;

	textarea.value = api_keys.join("\n");
}
async function saveKey(key: string, value: string, isUpdateSecretDisplay = true) {
	// 设置密钥
	await writeSecret(key, value);
	// 更新密钥显示
	if (isUpdateSecretDisplay) {
		updateSecretDisplay();
	}
	updateSecretDisplay();
	// 保存设置
	saveSettingsDebounced();
}
const GOOGLE_SOURCES = ["makersuite", "google"];
jQuery(async () => {
	// @ts-ignore
	const oldError = toastr.error;
	// @ts-ignore
	toastr.error = (/** @type { any[]} */ ...args) => {

		oldError(...args);
		console.log(args);
		console.error(...args);
		if (!isGeminiSource()) {
			return
		}
		const [message, type] = args;

		if (!type) {
			return
		}
		if (type === 'Chat Completion API') {
			const lastKeyElement = $("#last_key_maker_suite")[0] as HTMLSpanElement;
			throwGeminiError(`<h3>Chat Completion API 错误</h3>
				<p>${message}</p>
				<p> ${lastKeyElement.textContent}</p>`);
		}

	};

	// 获取form元素 id为"makersuite_form"的元素 用jquery的选择器
	const secrets = (await getSecrets()) ?? {};
	await init(secrets);
	const form = $("#makersuite_form")[0];
	// 创建div元素添加类为"flex-container flex"的类
	const flexContainer = document.createElement("div");
	flexContainer.classList.add("flex-container", "flex");
	// 添加h4元素 内容为"Google AI Studio API 多个密钥"
	const h4 = document.createElement("h4");
	h4.textContent = "Google AI Studio API 多个密钥";
	flexContainer.appendChild(h4);
	// 创建textare元素添加类为"text_pole textarea_compact autoSetHeight"的类
	const textarea = document.createElement("textarea");
	textarea.classList.add("text_pole", "textarea_compact", "autoSetHeight");
	// 设置placeholder属性
	textarea.placeholder = "API密钥";
	// 设置高度
	textarea.style.height = "100px";
	// 添加id属性
	textarea.id = "api_key_makersuite_custom";
	// 监听input事件
	textarea.addEventListener("change", () => {
		const value = textarea.value
			.split(/[\n;]/)
			.map((v) => v.trim())
			.filter((v) => v.length > 0 && v.startsWith("AIzaSy"));

		textarea.value = value.join("\n");
		if (value.length === 0) {
			saveKey(key, value.join("\n"));
			return;
		}
		const fistValue = value[0];
		writeSecret("api_key_makersuite", fistValue);
		saveKey(key, value.join("\n"));
	});
	textarea.value = secrets[key] || "";
	flexContainer.appendChild(textarea);
	// 创建div元素添加类为"flex-container flex"的类
	const flexContainer2 = document.createElement("div");
	// 添加h4元素 内容为"当前和最后一个密钥"
	const h42 = document.createElement("h4");
	h42.textContent = "密钥调用信息:";
	flexContainer2.appendChild(h42);
	// 创建span元素
	const span = document.createElement("div");
	// 设置内容
	span.textContent = `当前: ${secrets.api_key_makersuite}`;
	// 添加id属性 `current_key_maker_suite`
	span.id = "current_key_maker_suite";
	// 创建span元素
	const span2 = document.createElement("div");
	// 设置内容
	span2.textContent = `最后: ${secrets[key]?.split("\n").pop()}`;
	// 添加id属性 `last_key_maker_suite`
	span2.id = "last_key_maker_suite";
	const swtichDiv = document.createElement("div");
	// 设置内容
	swtichDiv.textContent = `密钥切换:${switchState ? "开" : "关"}`;
	// 添加id属性 `last_key_maker_suite`
	swtichDiv.id = "switch_key_maker_suite";
	flexContainer2.appendChild(span);
	flexContainer2.appendChild(span2);
	flexContainer2.appendChild(swtichDiv);
	form.appendChild(flexContainer2);
	form.appendChild(flexContainer);
	const modelButton = await createButton("获取新的模型", async () => {
		const secrets = (await getSecrets()) ?? {};
		await init(secrets);
	});
	const saveButton = await createButton("保存密钥", async () => {
		const value = textarea.value
			.split(/[\n;]/)
			.map((v) => v.trim())
			.filter((v) => v.length > 0 && v.startsWith("AIzaSy"));

		textarea.value = value.join("\n");
		if (value.length === 0) {
			saveKey(key, value.join("\n"));
			return;
		}
		const fistValue = value[0];
		writeSecret("api_key_makersuite", fistValue);
		saveKey(key, value.join("\n"));
	});

	const switchStateButton = await createButton("切换密钥设置", async () => {
		switchState = !switchState;
		localStorage.setItem("switch_key_maker_suite", switchState.toString());
		swtichDiv.textContent = `密钥切换:${switchState ? "开" : "关"}`;
	});
	const throwGeminiErrorButton = await createButton("查看报错原因", async () => {
		throwGeminiError();
	});
	const div = document.createElement("div");
	div.classList.add("flex-container", "flex");
	div.appendChild(saveButton);
	div.appendChild(modelButton);
	div.appendChild(switchStateButton);
	div.appendChild(throwGeminiErrorButton);
	form.appendChild(div);
	// 添加分割线
	form.appendChild(document.createElement("hr"));

	eventSource.on(
		event_types.CHAT_COMPLETION_SETTINGS_READY,
		switchSecretsFromArray,
	);
	eventSource.on(event_types.CHATCOMPLETION_MODEL_CHANGED, async (model: string) => {
		if (isGeminiSource()) await saveKey("api_key_makersuite_model", model);
	})
});
