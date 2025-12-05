"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
const feishuDm = ['feishu.cn', 'feishucdn.com', 'larksuitecdn.com', 'larksuite.com'];
block_basekit_server_api_1.basekit.addDomainList([
    ...feishuDm,
    // OpenAI & Azure
    'api.openai.com',
    'openai.azure.com',
    // Google
    'generativelanguage.googleapis.com',
    // Anthropic
    'api.anthropic.com',
    // DeepSeek
    'api.deepseek.com',
    // SiliconFlow (硅基流动)
    'api.siliconflow.cn',
    'api.siliconflow.com',
    // Moonshot (Kimi)
    'api.moonshot.cn',
    // Zhipu AI (ChatGLM)
    'open.bigmodel.cn',
    // Aliyun (DashScope)
    'dashscope.aliyuncs.com',
    // Volcengine (Doubao/Ark)
    'ark.cn-beijing.volces.com',
    // Yi (01.AI)
    'api.lingyiwanwu.com',
    // Baichuan
    'api.baichuan-ai.com',
    // Minimax
    'api.minimax.chat',
    // StepFun
    'api.stepfun.com',
    // Groq
    'api.groq.com',
    // Mistral
    'api.mistral.ai',
    // OpenRouter
    'openrouter.ai',
    // Perplexity
    'api.perplexity.ai',
    // Together AI
    'api.together.xyz',
    // 代理/中转服务
    'api.gptsapi.net'
]);
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
            key: 'model',
            label: '模型名称',
            component: block_basekit_server_api_1.FieldComponent.SingleSelect,
            validator: { required: false },
            props: {
                options: [
                    { label: 'gpt-5.1', value: 'gpt-5.1' },
                    { label: 'gemini-3-pro-preview', value: 'gemini-3-pro-preview' },
                    { label: 'gemini-2.5-pro', value: 'gemini-2.5-pro' },
                    { label: 'gemini-2.5-flash', value: 'gemini-2.5-flash' },
                    { label: '其他自定义模型', value: 'custom' }
                ]
            },
            tooltips: [
                { type: 'link', text: '【FBIF】AI大模型调用工具使用教程（必读）', link: 'https://foodtalks.feishu.cn/docx/LC6GdsT3uohkyIxvVr8cHT4DnCP' }
            ]
        },
        {
            key: 'model_custom',
            label: '输入其他模型名称（非必填）',
            component: block_basekit_server_api_1.FieldComponent.Input,
            validator: { required: false },
            props: { placeholder: '仅当上方选择“其他自定义模型”时生效' },
            tooltips: [
                { type: 'link', text: '点此查看模型列表', link: 'https://foodtalks.feishu.cn/docx/LC6GdsT3uohkyIxvVr8cHT4DnCP' }
            ]
        },
        {
            key: 'instruction',
            label: '提示词（Prompt）',
            component: block_basekit_server_api_1.FieldComponent.Input,
            validator: { required: true },
            props: { placeholder: '请输入指令' }
        },
        {
            key: 'request_url',
            label: '请求地址',
            component: block_basekit_server_api_1.FieldComponent.Input,
            validator: { required: true },
            props: { placeholder: 'https://api.openai.com/v1/responses' },
            tooltips: [
                { type: 'link', text: '【FBIF】AI大模型调用工具使用教程（必读）', link: 'https://foodtalks.feishu.cn/docx/LC6GdsT3uohkyIxvVr8cHT4DnCP' }
            ]
        },
        {
            key: 'apikey',
            label: 'Apikey',
            component: block_basekit_server_api_1.FieldComponent.Input,
            validator: { required: true },
            props: { placeholder: 'sk-...' },
            tooltips: [
                { type: 'link', text: '【FBIF】AI大模型调用工具使用教程（必读）', link: 'https://foodtalks.feishu.cn/docx/LC6GdsT3uohkyIxvVr8cHT4DnCP' }
            ]
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
                { key: 'cost', type: block_basekit_server_api_1.FieldType.Number, label: '预估花费(¥)', extra: { formatter: block_basekit_server_api_1.NumberFormatter.DIGITAL_ROUNDED_4 } }
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
            let selectedModel = (typeof model === 'object' ? model.value : model);
            // 如果选择了“其他自定义模型” (value: 'custom')，则将其视为未选择，从而让逻辑回退到使用 model_custom
            if (selectedModel === 'custom') {
                selectedModel = null;
            }
            const finalModel = selectedModel || model_custom;
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
            const isGptsApi = /api\.gptsapi\.net$/.test(host);
            if (/api\.openai\.com$/.test(host) || (isGptsApi && !isGemini) || isArk || isAliyun) {
                headers = { ...headers, Authorization: `Bearer ${apikey}` };
                if (isGptsApi) {
                    if (finalModel?.includes('gemini')) {
                        // GPTSAPI 针对 Gemini 模型使用标准 Chat 格式 (messages)
                        body = {
                            model: finalModel,
                            messages: [{ role: 'user', content: inputText }],
                            max_tokens: 4000
                        };
                    }
                    else {
                        // GPTSAPI 针对其他模型使用 input 格式
                        body = {
                            model: finalModel,
                            input: [
                                {
                                    role: 'user',
                                    content: [
                                        {
                                            type: 'input_text',
                                            text: inputText
                                        }
                                    ]
                                }
                            ],
                            max_tokens: 4000
                        };
                    }
                }
                else if (request_url.includes('/chat/completions') || request_url.includes('/messages') || isArk || isAliyun) {
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
                // 1. GPTSAPI 的 input 格式返回结构 (res.output)
                if (isGptsApi && Array.isArray(res?.output)) {
                    const outputItems = res.output || [];
                    resultText = outputItems
                        .map((item) => {
                        if (Array.isArray(item.content)) {
                            return item.content
                                .map((c) => c?.text || '')
                                .join('');
                        }
                        return '';
                    })
                        .filter(Boolean)
                        .join('\n')
                        .trim();
                    thinkingText = '';
                    if (res?.usage) {
                        inputTokens = res.usage.input_tokens || 0;
                        outputTokens = res.usage.output_tokens || 0;
                    }
                    else {
                        inputTokens = estimateTokens(inputText);
                        outputTokens = resultText ? estimateTokens(resultText) : 0;
                    }
                }
                // 2. GPTSAPI 的 messages 格式返回结构 (res.content, 类似于 Claude/Anthropic 风格或 OpenAI Chat 风格)
                else if (isGptsApi && Array.isArray(res?.content)) {
                    resultText = res.content
                        .map((c) => c?.text || '')
                        .filter(Boolean)
                        .join('');
                    thinkingText = '';
                    if (res?.usage) {
                        inputTokens = res.usage.input_tokens || 0;
                        outputTokens = res.usage.output_tokens || 0;
                    }
                    else {
                        inputTokens = estimateTokens(inputText);
                        outputTokens = resultText ? estimateTokens(resultText) : 0;
                    }
                }
                // 3. 标准 OpenAI Chat Completion 格式 (choices[0].message.content)
                else if (res?.choices?.[0]?.message?.content) {
                    resultText = res.choices[0].message.content;
                    if (res?.usage) {
                        inputTokens = res.usage.prompt_tokens || 0;
                        outputTokens = res.usage.completion_tokens || 0;
                    }
                    else {
                        inputTokens = estimateTokens(inputText);
                        outputTokens = resultText ? estimateTokens(resultText) : 0;
                    }
                }
                // 4. 其他情况 (如 output_text, raw 等)
                else {
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
            // 使用 finalModel（用户选择的模型）而不是 API 返回的模型来查找价格
            // API 返回的模型（如 gpt-5-2）可能只是内部负载均衡的别名，不影响计费标准
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFBdUk7QUFFdkksTUFBTSxRQUFRLEdBQUcsQ0FBQyxXQUFXLEVBQUUsZUFBZSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBQ3JGLGtDQUFPLENBQUMsYUFBYSxDQUFDO0lBQ3BCLEdBQUcsUUFBUTtJQUNYLGlCQUFpQjtJQUNqQixnQkFBZ0I7SUFDaEIsa0JBQWtCO0lBQ2xCLFNBQVM7SUFDVCxtQ0FBbUM7SUFDbkMsWUFBWTtJQUNaLG1CQUFtQjtJQUNuQixXQUFXO0lBQ1gsa0JBQWtCO0lBQ2xCLHFCQUFxQjtJQUNyQixvQkFBb0I7SUFDcEIscUJBQXFCO0lBQ3JCLGtCQUFrQjtJQUNsQixpQkFBaUI7SUFDakIscUJBQXFCO0lBQ3JCLGtCQUFrQjtJQUNsQixxQkFBcUI7SUFDckIsd0JBQXdCO0lBQ3hCLDBCQUEwQjtJQUMxQiwyQkFBMkI7SUFDM0IsYUFBYTtJQUNiLHFCQUFxQjtJQUNyQixXQUFXO0lBQ1gscUJBQXFCO0lBQ3JCLFVBQVU7SUFDVixrQkFBa0I7SUFDbEIsVUFBVTtJQUNWLGlCQUFpQjtJQUNqQixPQUFPO0lBQ1AsY0FBYztJQUNkLFVBQVU7SUFDVixnQkFBZ0I7SUFDaEIsYUFBYTtJQUNiLGVBQWU7SUFDZixhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLGNBQWM7SUFDZCxrQkFBa0I7SUFDbEIsVUFBVTtJQUNWLGlCQUFpQjtDQUNsQixDQUFDLENBQUM7QUFFSCwyQkFBMkI7QUFDM0IsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDO0FBRTNCLE1BQU0sU0FBUyxHQUFrRztJQUMvRyxTQUFTO0lBQ1QsMEJBQTBCLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO0lBQ3ZGLDRCQUE0QixFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtJQUN6RixxQ0FBcUMsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7SUFDbEcsMkJBQTJCLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO0lBRXZGLFNBQVM7SUFDVCxlQUFlLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO0lBQzVFLG9CQUFvQixFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtJQUNoRixTQUFTLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO0lBQ3RFLGNBQWMsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7SUFDM0UsYUFBYSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtJQUMxRSxZQUFZLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFF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