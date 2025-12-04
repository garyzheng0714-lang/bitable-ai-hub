"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
const feishuDm = ['feishu.cn', 'feishucdn.com', 'larksuitecdn.com', 'larksuite.com'];
block_basekit_server_api_1.basekit.addDomainList([...feishuDm, 'api.openai.com', 'openai.azure.com', 'generativelanguage.googleapis.com', 'api.gptsapi.net', 'ark.cn-beijing.volces.com', 'dashscope.aliyuncs.com']);
// 汇率：1 USD = 7.25 CNY (预估)
const EXCHANGE_RATE = 7.25;
const PRICE_MAP = {
    // Claude
    'claude-opus-4-5-20251101': { input: 5.00, output: 25.00, unit: '1m', currency: 'USD' },
    'claude-sonnet-4-5-20250929': { input: 3.00, output: 15.00, unit: '1m', currency: 'USD' },
    'claude-sonnet-4-5-20250929-thinking': { input: 3.00, output: 15.00, unit: '1m', currency: 'USD' },
    'claude-haiku-4-5-20251001': { input: 1.00, output: 5.00, unit: '1m', currency: 'USD' },
    // OpenAI
    'gpt-5.1-codex': { input: 1.25, output: 10.00, unit: '1m', currency: 'USD' },
    'gpt-5.1-codex-mini': { input: 0.25, output: 2.00, unit: '1m', currency: 'USD' },
    'gpt-5.1': { input: 1.25, output: 10.00, unit: '1m', currency: 'USD' },
    'gpt-5.1-chat': { input: 1.25, output: 10.00, unit: '1m', currency: 'USD' },
    'gpt-5-codex': { input: 1.25, output: 10.00, unit: '1m', currency: 'USD' },
    'gpt-5-chat': { input: 1.25, output: 10.00, unit: '1m', currency: 'USD' },
    'gpt-5': { input: 1.25, output: 10.00, unit: '1m', currency: 'USD' },
    'gpt-5-chat-latest': { input: 1.25, output: 10.00, unit: '1m', currency: 'USD' },
    'gpt-5-mini': { input: 0.25, output: 2.00, unit: '1m', currency: 'USD' },
    'gpt-5-mini-2025-08-07': { input: 0.25, output: 2.00, unit: '1m', currency: 'USD' },
    'gpt-5-nano': { input: 0.05, output: 0.40, unit: '1m', currency: 'USD' },
    'gpt-4.1': { input: 2.00, output: 8.00, unit: '1m', currency: 'USD' },
    'gpt-4.1-2025-04-14': { input: 2.00, output: 8.00, unit: '1m', currency: 'USD' },
    'gpt-4.1-mini': { input: 0.40, output: 1.60, unit: '1m', currency: 'USD' },
    'gpt-4.1-nano': { input: 0.10, output: 0.40, unit: '1m', currency: 'USD' },
    'o4-mini': { input: 1.10, output: 4.40, unit: '1m', currency: 'USD' },
    'gpt-4o': { input: 2.50, output: 10.00, unit: '1m', currency: 'USD' },
    'gpt-4o-2024-08-06': { input: 2.50, output: 10.00, unit: '1m', currency: 'USD' },
    'gpt-4o-mini': { input: 0.15, output: 0.60, unit: '1m', currency: 'USD' },
    'o3-mini': { input: 1.10, output: 4.40, unit: '1m', currency: 'USD' },
    'o1': { input: 16.50, output: 66.00, unit: '1m', currency: 'USD' },
    'o1-mini': { input: 3.00, output: 12.00, unit: '1m', currency: 'USD' },
    // Embeddings
    'text-embedding-ada-002': { input: 0.10, output: 0, unit: '1m', currency: 'USD' },
    'text-embedding-3-small': { input: 0.02, output: 0, unit: '1m', currency: 'USD' },
    'text-embedding-3-large': { input: 0.13, output: 0, unit: '1m', currency: 'USD' },
    // Gemini
    'gemini-3-pro-preview': { input: 2.00, output: 12.00, unit: '1m', currency: 'USD' },
    'gemini-2.5-flash': { input: 0.30, output: 2.50, unit: '1m', currency: 'USD' },
    'gemini-2.5-flash-lite': { input: 0.10, output: 0.40, unit: '1m', currency: 'USD' },
    'gemini-2.5-pro': { input: 1.25, output: 10.00, unit: '1m', currency: 'USD' },
    'gemini-2.5-flash-nothinking': { input: 0.30, output: 2.50, unit: '1m', currency: 'USD' },
    // DeepSeek
    'deepseek-r1': { input: 0.55, output: 2.48, unit: '1m', currency: 'USD' },
    // Grok
    'grok-4': { input: 3.00, output: 15.00, unit: '1m', currency: 'USD' },
    'grok-3-reasoner-r': { input: 3.00, output: 15.00, unit: '1m', currency: 'USD' },
    'grok-3': { input: 3.00, output: 15.00, unit: '1m', currency: 'USD' },
    'grok-3-mini': { input: 0.30, output: 0.50, unit: '1m', currency: 'USD' },
    // Aliyun Qwen (Keep existing CNY)
    'qwen-turbo': { input: 0.002, output: 0.006, unit: '1k', currency: 'CNY' },
    'qwen-plus': { input: 0.004, output: 0.012, unit: '1k', currency: 'CNY' },
    'qwen-max': { input: 0.04, output: 0.12, unit: '1k', currency: 'CNY' },
    'qwen-long': { input: 0.0005, output: 0.002, unit: '1k', currency: 'CNY' },
    // Volcengine Doubao (Keep existing CNY)
    'doubao-pro-32k': { input: 0.0008, output: 0.002, unit: '1k', currency: 'CNY' },
    'doubao-lite-32k': { input: 0.0003, output: 0.0006, unit: '1k', currency: 'CNY' },
};
block_basekit_server_api_1.basekit.addField({
    formItems: [
        {
            key: 'instruction',
            label: '输入指令',
            component: block_basekit_server_api_1.FieldComponent.Input,
            validator: { required: true },
            props: { placeholder: '请输入指令' }
        },
        {
            key: 'request_url',
            label: '请求地址',
            component: block_basekit_server_api_1.FieldComponent.Input,
            validator: { required: true },
            props: { placeholder: 'https://api.openai.com/v1/responses' }
        },
        {
            key: 'model',
            label: '模型名称',
            component: block_basekit_server_api_1.FieldComponent.SingleSelect,
            validator: { required: false },
            props: {
                options: [
                    { label: 'claude-opus-4-5-20251101', value: 'claude-opus-4-5-20251101' },
                    { label: 'claude-sonnet-4-5-20250929', value: 'claude-sonnet-4-5-20250929' },
                    { label: 'claude-sonnet-4-5-20250929-thinking', value: 'claude-sonnet-4-5-20250929-thinking' },
                    { label: 'claude-haiku-4-5-20251001', value: 'claude-haiku-4-5-20251001' },
                    { label: 'gpt-5.1-codex', value: 'gpt-5.1-codex' },
                    { label: 'gpt-5.1-codex-mini', value: 'gpt-5.1-codex-mini' },
                    { label: 'gpt-5.1', value: 'gpt-5.1' },
                    { label: 'gpt-5.1-chat', value: 'gpt-5.1-chat' },
                    { label: 'gpt-5-codex', value: 'gpt-5-codex' },
                    { label: 'gpt-5-chat', value: 'gpt-5-chat' },
                    { label: 'gpt-5', value: 'gpt-5' },
                    { label: 'gpt-5-chat-latest', value: 'gpt-5-chat-latest' },
                    { label: 'gpt-5-mini', value: 'gpt-5-mini' },
                    { label: 'gpt-5-mini-2025-08-07', value: 'gpt-5-mini-2025-08-07' },
                    { label: 'gpt-5-nano', value: 'gpt-5-nano' },
                    { label: 'gpt-4.1', value: 'gpt-4.1' },
                    { label: 'gpt-4.1-2025-04-14', value: 'gpt-4.1-2025-04-14' },
                    { label: 'gpt-4.1-mini', value: 'gpt-4.1-mini' },
                    { label: 'gpt-4.1-nano', value: 'gpt-4.1-nano' },
                    { label: 'o4-mini', value: 'o4-mini' },
                    { label: 'gpt-4o', value: 'gpt-4o' },
                    { label: 'gpt-4o-2024-08-06', value: 'gpt-4o-2024-08-06' },
                    { label: 'gpt-4o-mini', value: 'gpt-4o-mini' },
                    { label: 'o3-mini', value: 'o3-mini' },
                    { label: 'o1', value: 'o1' },
                    { label: 'o1-mini', value: 'o1-mini' },
                    { label: 'text-embedding-ada-002', value: 'text-embedding-ada-002' },
                    { label: 'text-embedding-3-small', value: 'text-embedding-3-small' },
                    { label: 'text-embedding-3-large', value: 'text-embedding-3-large' },
                    { label: 'tts-1', value: 'tts-1' },
                    { label: 'tts-1-hd', value: 'tts-1-hd' },
                    { label: 'whisper-1', value: 'whisper-1' },
                    { label: 'dall-e-3', value: 'dall-e-3' },
                    { label: 'gemini-3-pro-image-preview', value: 'gemini-3-pro-image-preview' },
                    { label: 'gemini-3-pro-preview', value: 'gemini-3-pro-preview' },
                    { label: 'gemini-2.5-flash', value: 'gemini-2.5-flash' },
                    { label: 'gemini-2.5-flash-image-hd', value: 'gemini-2.5-flash-image-hd' },
                    { label: 'gemini-2.5-flash-lite', value: 'gemini-2.5-flash-lite' },
                    { label: 'gemini-2.5-pro', value: 'gemini-2.5-pro' },
                    { label: 'gemini-2.5-flash-nothinking', value: 'gemini-2.5-flash-nothinking' },
                    { label: 'deepseek-r1', value: 'deepseek-r1' },
                    { label: 'grok-4', value: 'grok-4' },
                    { label: 'grok-3-reasoner-r', value: 'grok-3-reasoner-r' },
                    { label: 'grok-3', value: 'grok-3' },
                    { label: 'grok-3-mini', value: 'grok-3-mini' },
                    { label: 'qwen-turbo', value: 'qwen-turbo' },
                    { label: 'qwen-plus', value: 'qwen-plus' },
                    { label: 'qwen-max', value: 'qwen-max' },
                    { label: 'qwen-long', value: 'qwen-long' },
                    { label: 'qwen-vl-max', value: 'qwen-vl-max' },
                    { label: 'qwen-vl-plus', value: 'qwen-vl-plus' }
                ]
            },
            tooltips: [
                { type: 'link', text: '点此查看模型列表', link: 'https://foodtalks.feishu.cn/docx/LC6GdsT3uohkyIxvVr8cHT4DnCP' }
            ]
        },
        {
            key: 'model_custom',
            label: '输入其他模型型号',
            component: block_basekit_server_api_1.FieldComponent.Input,
            validator: { required: false },
            props: { placeholder: '如同时选择了下拉项，将优先使用下拉项模型' }
        },
        {
            key: 'apikey',
            label: 'Apikey',
            component: block_basekit_server_api_1.FieldComponent.Input,
            validator: { required: true },
            props: { placeholder: 'sk-...' }
        },
        {
            key: 'image_field',
            label: '图片内容',
            component: block_basekit_server_api_1.FieldComponent.FieldSelect,
            props: { supportType: [block_basekit_server_api_1.FieldType.Url, block_basekit_server_api_1.FieldType.Attachment] }
        },
        {
            key: 'video_field',
            label: '视频内容',
            component: block_basekit_server_api_1.FieldComponent.FieldSelect,
            props: { supportType: [block_basekit_server_api_1.FieldType.Url, block_basekit_server_api_1.FieldType.Attachment] }
        },
        {
            key: 'reasoning_mode',
            label: '是否进行深度思考',
            component: block_basekit_server_api_1.FieldComponent.SingleSelect,
            defaultValue: 'AI 自动判断',
            props: {
                options: [
                    { label: 'AI 自动判断', value: 'AI 自动判断' },
                    { label: '进行深度思考', value: '进行深度思考' },
                    { label: '不进行深度思考', value: '不进行深度思考' }
                ],
                placeholder: '仅部分模型（如 o1/o3/Doubao-pro等）支持'
            },
            tooltips: [
                { type: 'text', content: '此选项仅对支持 reasoning_effort 参数的模型生效（如 OpenAI o1/o3, 火山引擎 Doubao 部分模型）。DeepSeek R1 等默认开启思考的模型不受此选项控制。' }
            ]
        }
    ],
    resultType: {
        type: block_basekit_server_api_1.FieldType.Object,
        extra: {
            icon: { light: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/chatbot.svg' },
            properties: [
                { key: 'id', isGroupByKey: true, type: block_basekit_server_api_1.FieldType.Text, label: 'id', hidden: true },
                { key: 'result', type: block_basekit_server_api_1.FieldType.Text, label: '输出结果', primary: true },
                { key: 'thinking', type: block_basekit_server_api_1.FieldType.Text, label: '思考过程' },
                { key: 'input_tokens', type: block_basekit_server_api_1.FieldType.Number, label: '输入token', extra: { formatter: block_basekit_server_api_1.NumberFormatter.INTEGER } },
                { key: 'output_tokens', type: block_basekit_server_api_1.FieldType.Number, label: '输出token', extra: { formatter: block_basekit_server_api_1.NumberFormatter.INTEGER } },
                { key: 'cost', type: block_basekit_server_api_1.FieldType.Number, label: '预估花费(元)' }
            ]
        }
    },
    execute: async (formItemParams, context) => {
        function debugLog(arg, showContext = false) {
            if (!showContext) {
                console.log(JSON.stringify({ arg, logID: context.logID }), '\n');
                return;
            }
            console.log(JSON.stringify({ formItemParams, context, arg }), '\n');
        }
        debugLog('=====start=====v4', true);
        const fetchWrap = async (url, init, authId) => {
            try {
                const res = await context.fetch(url, init, authId);
                const resText = await res.text();
                debugLog({ [`===fetch res： ${url}`]: { url, init, authId, resText: resText.slice(0, 4000) } });
                try {
                    return JSON.parse(resText);
                }
                catch {
                    return { raw: resText };
                }
            }
            catch (e) {
                debugLog({ [`===fetch error： ${url}`]: { url, init, authId, error: e } });
                return { code: -1, error: e };
            }
        };
        try {
            const { instruction, request_url, model, model_custom, apikey, image_field, video_field, reasoning_mode } = formItemParams;
            const finalModel = model || model_custom;
            const toUrls = (v) => {
                const out = [];
                if (!v)
                    return out;
                if (typeof v === 'string') {
                    out.push(v);
                    return out;
                }
                if (Array.isArray(v)) {
                    for (const it of v) {
                        if (typeof it === 'string')
                            out.push(it);
                        else if (it && typeof it.url === 'string')
                            out.push(it.url);
                        else if (it && typeof it.link === 'string')
                            out.push(it.link);
                    }
                }
                return out;
            };
            const imageUrls = toUrls(image_field);
            const videoUrls = toUrls(video_field);
            let inputText = instruction || '';
            if (imageUrls.length)
                inputText += `\n图片链接: ${imageUrls.join(' ')}`;
            if (videoUrls.length)
                inputText += `\n视频链接: ${videoUrls.join(' ')}`;
            const deep = reasoning_mode === '进行深度思考';
            const urlObj = (() => { try {
                return new URL(request_url);
            }
            catch {
                return null;
            } })();
            const host = urlObj?.hostname || '';
            let headers = { 'Content-Type': 'application/json' };
            let body = {};
            const isGemini = /generativelanguage\.googleapis\.com$/.test(host) || request_url.includes(':generateContent');
            const isArk = /ark\.cn-beijing\.volces\.com$/.test(host);
            const isAliyun = /dashscope\.aliyuncs\.com$/.test(host);
            if (/api\.openai\.com$/.test(host) || (/api\.gptsapi\.net$/.test(host) && !isGemini) || isArk || isAliyun) {
                headers = { ...headers, Authorization: `Bearer ${apikey}` };
                body = { model: finalModel, messages: [{ role: 'user', content: inputText }] };
                // OpenAI / Ark 均支持 messages 格式，Ark 必须用 messages
                // 若是 OpenAI 旧版 text completion 可能需要 prompt，但现在一般都用 chat completion
                // 这里统一用 chat 格式，如果用户请求地址是 completions (非chat)，则可能报错，但万能连接器假设用户会填对地址
                // 兼容旧代码对 OpenAI 的处理（之前是 input: inputText），这里修正为标准 Chat 格式以适配 Ark
                // 如果原意是兼容 responses API（自定义），则保持原样？
                // 修正：OpenAI Responses API 是 { model, input } 吗？ 不，OpenAI 官方 Chat 是 { model, messages }
                // 之前代码用了 { model, input } 可能是针对特定代理或简化？
                // 查阅文档，OpenAI Chat Completions 是 messages。
                // 之前代码：body = { model, input: inputText }; 可能是误写或适配了某特定 endpoint？
                // 既然要适配 Ark（标准 OpenAI 兼容），这里改为标准 messages 结构。
                // 但为了不破坏之前对 "https://api.openai.com/v1/responses" (假如有这个endpoint?) 的支持...
                // 等等，用户之前填的是 /v1/responses 吗？OpenAI 官方没有 /v1/responses。
                // 假设用户填的是 /v1/chat/completions。
                // 修正逻辑：
                // 如果是 Ark 或 OpenAI Chat 接口，用 messages。
                if (request_url.includes('/chat/completions') || isArk || isAliyun) {
                    body = {
                        model: finalModel,
                        messages: [{ role: 'user', content: inputText }]
                    };
                }
                else {
                    // 保持原有 input 逻辑以防万一（针对非标准接口）
                    body = { model: finalModel, input: inputText };
                }
                if (deep)
                    body.reasoning = { effort: 'medium' };
            }
            else if (/openai\.azure\.com$/.test(host)) {
                headers = { ...headers, 'api-key': apikey };
                body = { messages: [{ role: 'user', content: inputText }] }; // Azure 也是 chat 格式
                if (deep)
                    body.reasoning = { effort: 'medium' };
            }
            else if (isGemini) {
                headers = { ...headers, 'x-goog-api-key': apikey };
                body = {
                    contents: [{ role: 'user', parts: [{ text: inputText }] }]
                };
            }
            else {
                headers = { ...headers, Authorization: `Bearer ${apikey}` };
                body = { model: finalModel, input: inputText };
                if (deep)
                    body.reasoning = { effort: 'medium' };
            }
            const res = await fetchWrap(request_url, { method: 'POST', headers, body: JSON.stringify(body) });
            const estimateTokens = (text) => {
                if (!text)
                    return 0;
                const len = text.length;
                return Math.max(1, Math.ceil(len / 4));
            };
            let resultText = '';
            let thinkingText = '';
            let inputTokens = 0;
            let outputTokens = 0;
            if (isGemini) {
                const parts = res?.candidates?.[0]?.content?.parts || [];
                resultText = parts.map(p => p?.text || '').filter(Boolean).join('\n').trim();
                // 尝试提取思维链 (thoughtSignature / thoughtsTokenCount 虽有但通常文本在 parts 里或者被隐藏，这里仅提取 text)
                if (res?.usageMetadata) {
                    inputTokens = res.usageMetadata.promptTokenCount || 0;
                    outputTokens = res.usageMetadata.candidatesTokenCount || 0;
                }
                else {
                    inputTokens = estimateTokens(inputText);
                    outputTokens = resultText ? estimateTokens(resultText) : 0;
                }
            }
            else {
                // 优先尝试从 OpenAI Responses 格式 output[0].content[0].text 提取
                const outputItem = res?.output?.[0];
                if (outputItem?.content?.[0]?.type === 'output_text') {
                    resultText = outputItem.content[0].text || '';
                }
                else {
                    // 兜底：如果不是标准 output 结构，尝试 output_text 或 raw
                    resultText = (res?.output_text ?? res?.raw ?? '');
                    if (!resultText && typeof res === 'object')
                        resultText = JSON.stringify(res);
                }
                thinkingText = '';
                // 从 usage 字段准确读取 token
                if (res?.usage) {
                    inputTokens = res.usage.input_tokens || 0;
                    outputTokens = res.usage.output_tokens || 0;
                }
                else {
                    inputTokens = estimateTokens(inputText);
                    outputTokens = resultText ? estimateTokens(resultText) : 0;
                }
            }
            const data = {
                id: `${Math.random()}`,
                result: resultText,
                thinking: thinkingText,
                input_tokens: inputTokens,
                output_tokens: outputTokens,
                cost: 0
            };
            // Calculate Cost
            const priceItem = PRICE_MAP[finalModel || ''];
            if (priceItem) {
                const divisor = priceItem.unit === '1k' ? 1000 : 1000000;
                let total = (inputTokens / divisor) * priceItem.input + (outputTokens / divisor) * priceItem.output;
                if (priceItem.currency === 'USD') {
                    total = total * EXCHANGE_RATE;
                }
                data.cost = parseFloat(total.toFixed(6));
            }
            return { code: block_basekit_server_api_1.FieldCode.Success, data };
        }
        catch (e) {
            debugLog({ '===999 异常错误': String(e) });
            return { code: block_basekit_server_api_1.FieldCode.Error };
        }
    }
});
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFBdUk7QUFFdkksTUFBTSxRQUFRLEdBQUcsQ0FBQyxXQUFXLEVBQUUsZUFBZSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBQ3JGLGtDQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsR0FBRyxRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsa0JBQWtCLEVBQUUsbUNBQW1DLEVBQUUsaUJBQWlCLEVBQUUsMkJBQTJCLEVBQUUsd0JBQXdCLENBQUMsQ0FBQyxDQUFDO0FBRTFMLDJCQUEyQjtBQUMzQixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUM7QUFFM0IsTUFBTSxTQUFTLEdBQWtHO0lBQy9HLFNBQVM7SUFDVCwwQkFBMEIsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7SUFDdkYsNEJBQTRCLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO0lBQ3pGLHFDQUFxQyxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtJQUNsRywyQkFBMkIsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7SUFFdkYsU0FBUztJQUNULGVBQWUsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7SUFDNUUsb0JBQW9CLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO0lBQ2hGLFNBQVMsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7SUFDdEUsY0FBYyxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtJQUMzRSxhQUFhLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO0lBQzFFLFlBQVksRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7SUFDekUsT0FBTyxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtJQUNwRSxtQkFBbUIsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7SUFDaEYsWUFBWSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtJQUN4RSx1QkFBdUIsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7SUFDbkYsWUFBWSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtJQUN4RSxTQUFTLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO0lBQ3JFLG9CQUFvQixFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtJQUNoRixjQUFjLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO0lBQzFFLGNBQWMsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7SUFDMUUsU0FBUyxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtJQUNyRSxRQUFRLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO0lBQ3JFLG1CQUFtQixFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtJQUNoRixhQUFhLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJ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