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
    // Volcengine Doubao (CNY per 1M tokens)
    // 在线推理价格
    'doubao-seed-code': { input: 1.4, output: 12.00, unit: '1m', currency: 'CNY' }, // (32, 128] 默认区间
    'doubao-seed-1.6': { input: 1.20, output: 16.00, unit: '1m', currency: 'CNY' }, // (32, 128] 默认区间
    'doubao-seed-1-6-251015': { input: 1.20, output: 16.00, unit: '1m', currency: 'CNY' }, // 兼容用户输入
    'doubao-seed-1.6-lite': { input: 0.60, output: 4.00, unit: '1m', currency: 'CNY' }, // (32, 128] 默认区间
    'doubao-seed-1.6-flash': { input: 0.30, output: 3.00, unit: '1m', currency: 'CNY' }, // (32, 128] 默认区间
    'doubao-seed-1.6-vision': { input: 1.20, output: 16.00, unit: '1m', currency: 'CNY' }, // (32, 128] 默认区间
    'doubao-seed-1.6-thinking': { input: 1.20, output: 16.00, unit: '1m', currency: 'CNY' }, // (32, 128] 默认区间
    'doubao-1.5-thinking-pro': { input: 4.00, output: 16.00, unit: '1m', currency: 'CNY' },
    'doubao-1.5-thinking-vision-pro': { input: 3.00, output: 9.00, unit: '1m', currency: 'CNY' },
    'doubao-1.5-pro-32k': { input: 0.80, output: 2.00, unit: '1m', currency: 'CNY' },
    'doubao-1.5-pro-256k': { input: 5.00, output: 9.00, unit: '1m', currency: 'CNY' },
    'doubao-1.5-lite-32k': { input: 0.30, output: 0.60, unit: '1m', currency: 'CNY' },
    'doubao-1.5-lite-256k': { input: 1.00, output: 2.00, unit: '1m', currency: 'CNY' },
    'doubao-1.5-vision-pro-32k': { input: 0.80, output: 2.00, unit: '1m', currency: 'CNY' },
    'doubao-1.5-vision-flash-32k': { input: 0.15, output: 1.50, unit: '1m', currency: 'CNY' },
    'doubao-1.5-vision-light-32k': { input: 0.30, output: 0.60, unit: '1m', currency: 'CNY' },
    'doubao-vision-img-v1': { input: 5.00, output: 9.00, unit: '1m', currency: 'CNY' },
    'doubao-1.5-flash': { input: 0.15, output: 1.50, unit: '1m', currency: 'CNY' }, // 假设同 vision flash
    // DeepSeek on Volcengine
    'deepseek-v3.1': { input: 4.00, output: 12.00, unit: '1m', currency: 'CNY' },
    'deepseek-r1-distill-qwen-32b': { input: 0.50, output: 2.00, unit: '1m', currency: 'CNY' },
    'deepseek-r1-distill-qwen-7b': { input: 0.20, output: 0.80, unit: '1m', currency: 'CNY' },
    'deepseek-r1-distill-llama-70b': { input: 1.00, output: 4.00, unit: '1m', currency: 'CNY' },
    'deepseek-r1-distill-llama-8b': { input: 0.20, output: 0.80, unit: '1m', currency: 'CNY' }
};
block_basekit_server_api_1.basekit.addField({
    formItems: [
        {
            key: 'model',
            label: '模型名称',
            component: block_basekit_server_api_1.FieldComponent.SingleSelect,
            validator: { required: true },
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
            label: '填入自定义模型名称',
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
        },
        {
            key: 'max_output_tokens',
            label: '最大输出Token',
            component: block_basekit_server_api_1.FieldComponent.Input,
            validator: { required: false },
            props: { placeholder: '默认为 4096' },
            tooltips: [
                { type: 'text', content: '控制模型生成的最大长度。如果不填，默认为 4096。\n\n【Token 说明】\n• 换算：1000 Token ≈ 750 个英文单词 ≈ 500 个汉字（仅供参考，不同模型有差异）。\n• 计费：模型服务商通常按照 Token 总量（输入+输出）进行计费。设置此限制有助于控制输出长度和成本。' }
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
            const { instruction, request_url, model, model_custom, apikey, image_field, video_field, reasoning_mode, max_output_tokens } = formItemParams;
            const finalMaxTokens = max_output_tokens ? parseInt(max_output_tokens, 10) : 4096;
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
                // 火山引擎不需要 Authorization: Bearer ...，而是直接 Authorization: apikey
                // 但很多兼容层可能还是用 Bearer。不过根据 curl 示例，用户用的是 Bearer。
                // 修正：用户提供的 curl 示例明确使用了 Authorization: Bearer <apikey>
                // 所以这里保持 Bearer 前缀是正确的。
                if (isGptsApi) {
                    if (finalModel?.includes('gemini')) {
                        // GPTSAPI 针对 Gemini 模型使用标准 Chat 格式 (messages)
                        body = {
                            model: finalModel,
                            messages: [{ role: 'user', content: inputText }],
                            max_tokens: finalMaxTokens
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
                            max_tokens: finalMaxTokens
                        };
                    }
                }
                else if (isArk) {
                    // 火山引擎 (Doubao/Ark) 适配
                    // 文档参考: https://www.volcengine.com/docs/82379/1298454
                    const messages = [
                        {
                            role: 'user',
                            content: []
                        }
                    ];
                    // 1. 添加图片 (如果存在)
                    if (imageUrls.length > 0) {
                        for (const imgUrl of imageUrls) {
                            messages[0].content.push({
                                type: 'input_image', // 火山引擎图片类型为 input_image，注意这里是 'image_url' 结构
                                image_url: imgUrl // 火山引擎直接使用 image_url 字段存放链接，而不是 image_url: { url: ... }
                            });
                        }
                    }
                    // 2. 添加文本 (Instruction)
                    // 无论是否有图片，instruction 都作为 text 添加
                    if (inputText) {
                        // 如果没有图片，content 可以直接是字符串，但为了统一支持多模态，这里统一使用 array 结构
                        messages[0].content.push({
                            type: 'input_text', // 火山引擎文本类型为 input_text (注意区分 OpenAI 的 text)
                            text: instruction || '' // 这里只放纯文本指令，不包含图片链接文本，图片链接已在上一步作为 input_image 添加
                        });
                    }
                    else if (messages[0].content.length === 0) {
                        // 防止空内容
                        messages[0].content.push({ type: 'input_text', text: ' ' });
                    }
                    // 如果是火山引擎，且请求地址不包含 chat/completions 或 messages，则很可能是 bot 类型的 endpoint
                    // 此时需要把 messages 字段改为 input
                    // 参考: https://www.volcengine.com/docs/82379/1298454 (Bot Chat) vs (Chat Completion)
                    if (isArk && !request_url.includes('/chat/completions') && !request_url.includes('/messages')) {
                        body = {
                            model: finalModel,
                            input: messages // Bot API 使用 input 字段接收 messages 结构, Bot API 不支持 max_tokens 字段
                        };
                    }
                    else {
                        body = {
                            model: finalModel,
                            messages: messages,
                            max_tokens: finalMaxTokens
                        };
                    }
                }
                else if (request_url.includes('/chat/completions') || request_url.includes('/messages') || isAliyun) {
                    body = {
                        model: finalModel,
                        messages: [{ role: 'user', content: inputText }],
                        max_tokens: finalMaxTokens
                    };
                }
                else {
                    // 保持原有 input 逻辑以防万一（针对非标准接口）
                    body = { model: finalModel, input: inputText, max_tokens: finalMaxTokens };
                }
                if (deep)
                    body.reasoning = { effort: 'medium' };
            }
            else if (/openai\.azure\.com$/.test(host)) {
                headers = { ...headers, 'api-key': apikey };
                body = {
                    messages: [{ role: 'user', content: inputText }],
                    max_tokens: finalMaxTokens
                }; // Azure 也是 chat 格式
                if (deep)
                    body.reasoning = { effort: 'medium' };
            }
            else if (isGemini) {
                headers = { ...headers, 'x-goog-api-key': apikey };
                body = {
                    contents: [{ role: 'user', parts: [{ text: inputText }] }],
                    generationConfig: { maxOutputTokens: finalMaxTokens }
                };
            }
            else {
                headers = { ...headers, Authorization: `Bearer ${apikey}` };
                body = { model: finalModel, input: inputText, max_tokens: finalMaxTokens };
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
                // 1. 火山引擎 Bot 模式 (isArk)
                if (isArk && Array.isArray(res?.output)) {
                    // 提取 thinking (summary)
                    const reasoningItem = res.output.find((item) => item.type === 'reasoning');
                    if (reasoningItem && Array.isArray(reasoningItem.summary)) {
                        thinkingText = reasoningItem.summary
                            .map((s) => s?.text || '')
                            .join('\n');
                    }
                    else {
                        thinkingText = '';
                    }
                    // 提取 result (message content)
                    const messageItem = res.output.find((item) => item.type === 'message' && item.role === 'assistant');
                    if (messageItem && Array.isArray(messageItem.content)) {
                        resultText = messageItem.content
                            .map((c) => c?.text || '')
                            .join('\n');
                    }
                    else {
                        resultText = '';
                    }
                    if (res?.usage) {
                        inputTokens = res.usage.input_tokens || 0;
                        outputTokens = res.usage.output_tokens || 0;
                    }
                    else {
                        inputTokens = estimateTokens(inputText);
                        outputTokens = resultText ? estimateTokens(resultText) : 0;
                    }
                }
                // 2. GPTSAPI 的 input 格式返回结构 (res.output)
                else if (isGptsApi && Array.isArray(res?.output)) {
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
                // 4. 火山引擎 Bot API 格式 (res.output 包含 type: 'reasoning' 和 'message')
                else if (isArk && Array.isArray(res?.output)) {
                    // 提取 thinking (summary)
                    const reasoningItem = res.output.find((item) => item.type === 'reasoning');
                    if (reasoningItem && Array.isArray(reasoningItem.summary)) {
                        thinkingText = reasoningItem.summary
                            .map((s) => s?.text || '')
                            .join('\n');
                    }
                    else {
                        thinkingText = '';
                    }
                    // 提取 result (message content)
                    const messageItem = res.output.find((item) => item.type === 'message' && item.role === 'assistant');
                    if (messageItem && Array.isArray(messageItem.content)) {
                        resultText = messageItem.content
                            .map((c) => c?.text || '')
                            .join('\n');
                    }
                    else {
                        resultText = '';
                    }
                    if (res?.usage) {
                        inputTokens = res.usage.input_tokens || 0;
                        outputTokens = res.usage.output_tokens || 0;
                    }
                    else {
                        inputTokens = estimateTokens(inputText);
                        outputTokens = resultText ? estimateTokens(resultText) : 0;
                    }
                }
                // 5. 其他情况 (如 output_text, raw 等，或者 content 直接返回了 JSON 字符串)
                else {
                    if (outputItem?.content?.[0]?.type === 'output_text') {
                        resultText = outputItem.content[0].text || '';
                    }
                    else if (typeof res?.result === 'string' && res.result.startsWith('{')) {
                        // 某些情况下，result 可能是一个 JSON 字符串 (如 error message 被包装在 result 里)
                        // 尝试解析 result
                        try {
                            const parsed = JSON.parse(res.result);
                            if (parsed.error) {
                                // 如果解析出来包含 error，则说明是错误信息
                                resultText = res.result;
                            }
                            else if (parsed.raw) {
                                // 之前逻辑里有 return { raw: resText }
                                resultText = parsed.raw;
                            }
                            else {
                                resultText = res.result;
                            }
                        }
                        catch {
                            resultText = res.result;
                        }
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