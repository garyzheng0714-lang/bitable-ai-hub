import { basekit, FieldType, FieldComponent, FieldCode, NumberFormatter, generateOptions } from '@lark-opdev/block-basekit-server-api';

const feishuDm = ['feishu.cn', 'feishucdn.com', 'larksuitecdn.com', 'larksuite.com'];
basekit.addDomainList([
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

const PRICE_MAP: Record<string, { input: number, output: number, unit: '1k' | '1m', currency: 'USD' | 'CNY' }> = {
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

basekit.addField({
  formItems: [
    {
      key: 'model',
      label: '模型名称',
      component: FieldComponent.SingleSelect,
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
      component: FieldComponent.Input,
      validator: { required: false },
      props: { placeholder: '仅当上方选择“其他自定义模型”时生效' },
      tooltips: [
        { type: 'link', text: '点此查看模型列表', link: 'https://foodtalks.feishu.cn/docx/LC6GdsT3uohkyIxvVr8cHT4DnCP' }
      ]
    },
    {
      key: 'instruction',
      label: '提示词（Prompt）',
      component: FieldComponent.Input,
      validator: { required: true },
      props: { placeholder: '请输入指令' }
    },
    {
      key: 'request_url',
      label: '请求地址',
      component: FieldComponent.Input,
      validator: { required: true },
      props: { placeholder: 'https://api.openai.com/v1/responses' },
      tooltips: [
        { type: 'link', text: '【FBIF】AI大模型调用工具使用教程（必读）', link: 'https://foodtalks.feishu.cn/docx/LC6GdsT3uohkyIxvVr8cHT4DnCP' }
      ]
    },
    {
      key: 'apikey',
      label: 'Apikey',
      component: FieldComponent.Input,
      validator: { required: true },
      props: { placeholder: 'sk-...' },
      tooltips: [
        { type: 'link', text: '【FBIF】AI大模型调用工具使用教程（必读）', link: 'https://foodtalks.feishu.cn/docx/LC6GdsT3uohkyIxvVr8cHT4DnCP' }
      ]
    },
    {
      key: 'image_field',
      label: '图片内容',
      component: FieldComponent.FieldSelect,
      props: { supportType: [FieldType.Url, FieldType.Attachment] }
    },
    {
      key: 'video_field',
      label: '视频内容',
      component: FieldComponent.FieldSelect,
      props: { supportType: [FieldType.Url, FieldType.Attachment] }
    },
    {
      key: 'reasoning_mode',
      label: '是否进行深度思考',
      component: FieldComponent.SingleSelect,
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
      component: FieldComponent.Input,
      validator: { required: false },
      props: { placeholder: '默认为 4096' },
      tooltips: [
        { type: 'text', content: '控制模型生成的最大长度。如果不填，默认为 4096。\n\n【Token 说明】\n• 换算：1000 Token ≈ 750 个英文单词 ≈ 500 个汉字（仅供参考，不同模型有差异）。\n• 计费：模型服务商通常按照 Token 总量（输入+输出）进行计费。设置此限制有助于控制输出长度和成本。' }
      ]
    }
  ],
  resultType: {
    type: FieldType.Object,
    extra: {
      icon: { light: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/chatbot.svg' },
      properties: [
        { key: 'id', isGroupByKey: true, type: FieldType.Text, label: 'id', hidden: true },
        { key: 'result', type: FieldType.Text, label: '输出结果', primary: true },
        { key: 'thinking', type: FieldType.Text, label: '思考过程' },
        { key: 'input_tokens', type: FieldType.Number, label: '输入token', extra: { formatter: NumberFormatter.INTEGER } },
        { key: 'output_tokens', type: FieldType.Number, label: '输出token', extra: { formatter: NumberFormatter.INTEGER } },
        { key: 'cost', type: FieldType.Number, label: '预估花费(¥)', extra: { formatter: NumberFormatter.DIGITAL_ROUNDED_4 } }
      ]
    }
  },
  execute: async (
    formItemParams: {
      instruction: string,
      request_url: string,
      model?: string,
      model_custom?: string,
      apikey: string,
      image_field?: any,
      video_field?: any,
      reasoning_mode?: string,
      max_output_tokens?: string
    },
    context
  ) => {
    function debugLog(arg: any, showContext = false) {
      if (!showContext) {
        console.log(JSON.stringify({ arg, logID: context.logID }), '\n');
        return;
      }
      console.log(JSON.stringify({ formItemParams, context, arg }), '\n');
    }

    debugLog('=====start=====v4', true);

    const fetchWrap: <T = Object>(...arg: Parameters<typeof context.fetch>) => Promise<T | { code: number, error: any, [p: string]: any }> = async (url, init, authId) => {
      try {
        const res = await context.fetch(url, init, authId);
        const resText = await res.text();
        debugLog({ [`===fetch res： ${url}`]: { url, init, authId, resText: resText.slice(0, 4000) } });
        try { return JSON.parse(resText); } catch { return { raw: resText } as any; }
      } catch (e) {
        debugLog({ [`===fetch error： ${url}`]: { url, init, authId, error: e } });
        return { code: -1, error: e } as any;
      }
    };

    try {
      const {
        instruction,
        request_url,
        model,
        model_custom,
        apikey,
        image_field,
        video_field,
        reasoning_mode,
        max_output_tokens
      } = formItemParams;

      const finalMaxTokens = max_output_tokens ? parseInt(max_output_tokens, 10) : 4096;

      let selectedModel = (typeof model === 'object' ? (model as any).value : model);
      // 如果选择了“其他自定义模型” (value: 'custom')，则将其视为未选择，从而让逻辑回退到使用 model_custom
      if (selectedModel === 'custom') {
        selectedModel = null;
      }
      const finalModel = selectedModel || model_custom;

      const toUrls = (v: any): string[] => {
        const out: string[] = [];
        if (!v) return out;
        if (typeof v === 'string') { out.push(v); return out; }
        if (Array.isArray(v)) {
          for (const it of v) {
            if (typeof it === 'string') out.push(it);
            else if (it && typeof it.url === 'string') out.push(it.url);
            else if (it && typeof it.link === 'string') out.push(it.link);
          }
        }
        return out;
      };

      const imageUrls = toUrls(image_field);
      const videoUrls = toUrls(video_field);
      let inputText = instruction || '';
      if (imageUrls.length) inputText += `\n图片链接: ${imageUrls.join(' ')}`;
      if (videoUrls.length) inputText += `\n视频链接: ${videoUrls.join(' ')}`;

      const deep = reasoning_mode === '进行深度思考';

      const urlObj = (() => { try { return new URL(request_url); } catch { return null; } })();
      const host = urlObj?.hostname || '';

      let headers: Record<string, string> = { 'Content-Type': 'application/json' };
      let body: any = {};

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
              messages: [ { role: 'user', content: inputText } ],
              max_tokens: finalMaxTokens
            };
          } else {
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
        } else if (isArk) {
          // 火山引擎 (Doubao/Ark) 适配
          // 文档参考: https://www.volcengine.com/docs/82379/1298454
          const messages: any[] = [
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
          } else if (messages[0].content.length === 0) {
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
          } else {
               body = {
                   model: finalModel,
                   messages: messages,
                   max_tokens: finalMaxTokens
               };
          }
        } else if (request_url.includes('/chat/completions') || request_url.includes('/messages') || isAliyun) {
             body = { 
                 model: finalModel, 
                 messages: [ { role: 'user', content: inputText } ],
                 max_tokens: finalMaxTokens
             };
        } else {
             // 保持原有 input 逻辑以防万一（针对非标准接口）
             body = { model: finalModel, input: inputText, max_tokens: finalMaxTokens };
        }

        if (deep) body.reasoning = { effort: 'medium' };
      } else if (/openai\.azure\.com$/.test(host)) {
        headers = { ...headers, 'api-key': apikey };
        body = { 
          messages: [{ role: 'user', content: inputText }],
          max_tokens: finalMaxTokens
        }; // Azure 也是 chat 格式
        if (deep) body.reasoning = { effort: 'medium' };
      } else if (isGemini) {
        headers = { ...headers, 'x-goog-api-key': apikey };
        body = {
          contents: [ { role: 'user', parts: [ { text: inputText } ] } ],
          generationConfig: { maxOutputTokens: finalMaxTokens }
        };
      } else {
        headers = { ...headers, Authorization: `Bearer ${apikey}` };
        body = { model: finalModel, input: inputText, max_tokens: finalMaxTokens };
        if (deep) body.reasoning = { effort: 'medium' };
      }

      const res: any = await fetchWrap(request_url, { method: 'POST', headers, body: JSON.stringify(body) });

      const estimateTokens = (text: string) => {
        if (!text) return 0;
        const len = text.length;
        return Math.max(1, Math.ceil(len / 4));
      };

      let resultText = '';
      let thinkingText = '';
      let inputTokens = 0;
      let outputTokens = 0;

      if (isGemini) {
        const parts: any[] = res?.candidates?.[0]?.content?.parts || [];
        resultText = parts.map(p => p?.text || '').filter(Boolean).join('\n').trim();
        // 尝试提取思维链 (thoughtSignature / thoughtsTokenCount 虽有但通常文本在 parts 里或者被隐藏，这里仅提取 text)
        
        if (res?.usageMetadata) {
            inputTokens = res.usageMetadata.promptTokenCount || 0;
            outputTokens = res.usageMetadata.candidatesTokenCount || 0;
        } else {
            inputTokens = estimateTokens(inputText);
            outputTokens = resultText ? estimateTokens(resultText) : 0;
        }
      } else {
        // 优先尝试从 OpenAI Responses 格式 output[0].content[0].text 提取
        const outputItem = res?.output?.[0];
        
        // 1. 火山引擎 Bot 模式 (isArk)
        if (isArk && Array.isArray(res?.output)) {
             // 提取 thinking (summary)
             const reasoningItem = res.output.find((item: any) => item.type === 'reasoning');
             if (reasoningItem && Array.isArray(reasoningItem.summary)) {
                 thinkingText = reasoningItem.summary
                     .map((s: any) => s?.text || '')
                     .join('\n');
             } else {
                 thinkingText = '';
             }

             // 提取 result (message content)
             const messageItem = res.output.find((item: any) => item.type === 'message' && item.role === 'assistant');
             if (messageItem && Array.isArray(messageItem.content)) {
                 resultText = messageItem.content
                     .map((c: any) => c?.text || '')
                     .join('\n');
             } else {
                 resultText = '';
             }

             if (res?.usage) {
                 inputTokens = res.usage.input_tokens || 0;
                 outputTokens = res.usage.output_tokens || 0;
             } else {
                 inputTokens = estimateTokens(inputText);
                 outputTokens = resultText ? estimateTokens(resultText) : 0;
             }
        } 
        // 2. GPTSAPI 的 input 格式返回结构 (res.output)
        else if (isGptsApi && Array.isArray(res?.output)) {
            const outputItems = res.output || [];
            resultText = outputItems
              .map((item: any) => {
                if (Array.isArray(item.content)) {
                  return item.content
                    .map((c: any) => c?.text || '')
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
            } else {
                inputTokens = estimateTokens(inputText);
                outputTokens = resultText ? estimateTokens(resultText) : 0;
            }
        } 
        // 2. GPTSAPI 的 messages 格式返回结构 (res.content, 类似于 Claude/Anthropic 风格或 OpenAI Chat 风格)
        else if (isGptsApi && Array.isArray(res?.content)) {
             resultText = res.content
               .map((c: any) => c?.text || '')
               .filter(Boolean)
               .join('');
             
             thinkingText = '';
             if (res?.usage) {
                 inputTokens = res.usage.input_tokens || 0;
                 outputTokens = res.usage.output_tokens || 0;
             } else {
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
             } else {
                 inputTokens = estimateTokens(inputText);
                 outputTokens = resultText ? estimateTokens(resultText) : 0;
             }
        }
        // 4. 火山引擎 Bot API 格式 (res.output 包含 type: 'reasoning' 和 'message')
        else if (isArk && Array.isArray(res?.output)) {
             // 提取 thinking (summary)
             const reasoningItem = res.output.find((item: any) => item.type === 'reasoning');
             if (reasoningItem && Array.isArray(reasoningItem.summary)) {
                 thinkingText = reasoningItem.summary
                     .map((s: any) => s?.text || '')
                     .join('\n');
             } else {
                 thinkingText = '';
             }

             // 提取 result (message content)
             const messageItem = res.output.find((item: any) => item.type === 'message' && item.role === 'assistant');
             if (messageItem && Array.isArray(messageItem.content)) {
                 resultText = messageItem.content
                     .map((c: any) => c?.text || '')
                     .join('\n');
             } else {
                 resultText = '';
             }

             if (res?.usage) {
                 inputTokens = res.usage.input_tokens || 0;
                 outputTokens = res.usage.output_tokens || 0;
             } else {
                 inputTokens = estimateTokens(inputText);
                 outputTokens = resultText ? estimateTokens(resultText) : 0;
             }
        }
        // 5. 其他情况 (如 output_text, raw 等，或者 content 直接返回了 JSON 字符串)
        else {
            if (outputItem?.content?.[0]?.type === 'output_text') {
                resultText = outputItem.content[0].text || '';
            } else if (typeof res?.result === 'string' && res.result.startsWith('{')) {
                 // 某些情况下，result 可能是一个 JSON 字符串 (如 error message 被包装在 result 里)
                 // 尝试解析 result
                 try {
                     const parsed = JSON.parse(res.result);
                     if (parsed.error) {
                         // 如果解析出来包含 error，则说明是错误信息
                         resultText = res.result;
                     } else if (parsed.raw) {
                         // 之前逻辑里有 return { raw: resText }
                         resultText = parsed.raw;
                     } else {
                         resultText = res.result;
                     }
                 } catch {
                     resultText = res.result;
                 }
            } else {
                // 兜底：如果不是标准 output 结构，尝试 output_text 或 raw
                resultText = (res?.output_text ?? res?.raw ?? '') as string;
                if (!resultText && typeof res === 'object') resultText = JSON.stringify(res);
            }
            
            thinkingText = '';
    
            // 从 usage 字段准确读取 token
            if (res?.usage) {
                inputTokens = res.usage.input_tokens || 0;
                outputTokens = res.usage.output_tokens || 0;
            } else {
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

      return { code: FieldCode.Success, data };
    } catch (e) {
      debugLog({ '===999 异常错误': String(e) });
      return { code: FieldCode.Error };
    }
  }

});
export default basekit;
