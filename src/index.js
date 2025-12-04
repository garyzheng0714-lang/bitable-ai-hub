"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
const feishuDm = ['feishu.cn', 'feishucdn.com', 'larksuitecdn.com', 'larksuite.com'];
block_basekit_server_api_1.basekit.addDomainList([...feishuDm, 'api.openai.com', 'openai.azure.com', 'generativelanguage.googleapis.com']);
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
            component: block_basekit_server_api_1.FieldComponent.Input,
            validator: { required: true },
            props: { placeholder: 'gpt-4.1-mini / gpt-5 / ...' },
            tooltips: [
                { type: 'link', text: '点此查看模型列表', link: 'https://foodtalks.feishu.cn/docx/LC6GdsT3uohkyIxvVr8cHT4DnCP' }
            ]
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
            props: { options: (0, block_basekit_server_api_1.generateOptions)(['AI 自动判断', '进行深度思考', '不进行深度思考']) }
        },
        {
            key: 'more_info',
            label: '获取更多信息',
            component: block_basekit_server_api_1.FieldComponent.MultipleSelect,
            props: { options: (0, block_basekit_server_api_1.generateOptions)(['思考过程', '输出结果']) }
        },
        {
            key: 'input_tokens_max',
            label: '输入token',
            component: block_basekit_server_api_1.FieldComponent.Input,
            props: { placeholder: '估算/上限（可选）' }
        },
        {
            key: 'output_tokens_max',
            label: '输出token',
            component: block_basekit_server_api_1.FieldComponent.Input,
            props: { placeholder: 'max_output_tokens（可选）' }
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
                { key: 'output_tokens', type: block_basekit_server_api_1.FieldType.Number, label: '输出token', extra: { formatter: block_basekit_server_api_1.NumberFormatter.INTEGER } }
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
        debugLog('=====start=====v2', true);
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
            const { instruction, request_url, model, apikey, image_field, video_field, reasoning_mode, more_info, input_tokens_max, output_tokens_max } = formItemParams;
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
            const wantsThinking = Array.isArray(more_info) ? more_info.includes('思考过程') : true;
            const wantsOutput = Array.isArray(more_info) ? more_info.includes('输出结果') : true;
            const outputMax = typeof output_tokens_max === 'number' ? output_tokens_max : parseInt(String(output_tokens_max || ''), 10);
            const inputMax = typeof input_tokens_max === 'number' ? input_tokens_max : parseInt(String(input_tokens_max || ''), 10);
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
            if (/api\.openai\.com$/.test(host)) {
                headers = { ...headers, Authorization: `Bearer ${apikey}` };
                body = { model, input: inputText };
                if (outputMax && !Number.isNaN(outputMax))
                    body.max_output_tokens = outputMax;
                if (deep)
                    body.reasoning = { effort: 'medium' };
            }
            else if (/openai\.azure\.com$/.test(host)) {
                headers = { ...headers, 'api-key': apikey };
                body = { input: inputText };
                if (outputMax && !Number.isNaN(outputMax))
                    body.max_output_tokens = outputMax;
                if (deep)
                    body.reasoning = { effort: 'medium' };
            }
            else if (/generativelanguage\.googleapis\.com$/.test(host)) {
                headers = { ...headers, 'x-goog-api-key': apikey };
                body = {
                    contents: [{ parts: [{ text: inputText }] }],
                    generationConfig: {}
                };
                if (outputMax && !Number.isNaN(outputMax))
                    body.generationConfig.maxOutputTokens = outputMax;
            }
            else {
                headers = { ...headers, Authorization: `Bearer ${apikey}` };
                body = { model, input: inputText };
                if (outputMax && !Number.isNaN(outputMax))
                    body.max_output_tokens = outputMax;
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
            if (/generativelanguage\.googleapis\.com$/.test(host)) {
                const parts = res?.candidates?.[0]?.content?.parts || [];
                resultText = parts.map(p => p?.text || '').filter(Boolean).join('\n').trim();
            }
            else {
                resultText = (res?.output_text ?? res?.raw ?? '');
                if (!resultText && typeof res === 'object')
                    resultText = JSON.stringify(res);
                thinkingText = '';
            }
            const inputTokens = inputMax && !Number.isNaN(inputMax) ? inputMax : estimateTokens(inputText);
            const outputTokens = resultText ? estimateTokens(resultText) : (outputMax && !Number.isNaN(outputMax) ? outputMax : 0);
            const data = {
                id: `${Math.random()}`,
                result: wantsOutput ? resultText : '',
                thinking: wantsThinking ? thinkingText : '',
                input_tokens: inputTokens,
                output_tokens: outputTokens
            };
            return { code: block_basekit_server_api_1.FieldCode.Success, data };
        }
        catch (e) {
            debugLog({ '===999 异常错误': String(e) });
            return { code: block_basekit_server_api_1.FieldCode.Error };
        }
    }
});
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1GQUF1STtBQUV2SSxNQUFNLFFBQVEsR0FBRyxDQUFDLFdBQVcsRUFBRSxlQUFlLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxDQUFDLENBQUM7QUFDckYsa0NBQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxHQUFHLFFBQVEsRUFBRSxnQkFBZ0IsRUFBRSxrQkFBa0IsRUFBRSxtQ0FBbUMsQ0FBQyxDQUFDLENBQUM7QUFFaEgsa0NBQU8sQ0FBQyxRQUFRLENBQUM7SUFDZixTQUFTLEVBQUU7UUFDVDtZQUNFLEdBQUcsRUFBRSxhQUFhO1lBQ2xCLEtBQUssRUFBRSxNQUFNO1lBQ2IsU0FBUyxFQUFFLHlDQUFjLENBQUMsS0FBSztZQUMvQixTQUFTLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzdCLEtBQUssRUFBRSxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUU7U0FDaEM7UUFDRDtZQUNFLEdBQUcsRUFBRSxhQUFhO1lBQ2xCLEtBQUssRUFBRSxNQUFNO1lBQ2IsU0FBUyxFQUFFLHlDQUFjLENBQUMsS0FBSztZQUMvQixTQUFTLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO1lBQzdCLEtBQUssRUFBRSxFQUFFLFdBQVcsRUFBRSxxQ0FBcUMsRUFBRTtTQUM5RDtRQUNEO1lBQ0UsR0FBRyxFQUFFLE9BQU87WUFDWixLQUFLLEVBQUUsTUFBTTtZQUNiLFNBQVMsRUFBRSx5Q0FBYyxDQUFDLEtBQUs7WUFDL0IsU0FBUyxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUM3QixLQUFLLEVBQUUsRUFBRSxXQUFXLEVBQUUsNEJBQTRCLEVBQUU7WUFDcEQsUUFBUSxFQUFFO2dCQUNSLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSw4REFBOEQsRUFBRTthQUN6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