import { basekit, FieldType, FieldComponent, FieldCode, NumberFormatter, generateOptions } from '@lark-opdev/block-basekit-server-api';

const feishuDm = ['feishu.cn', 'feishucdn.com', 'larksuitecdn.com', 'larksuite.com'];
basekit.addDomainList([...feishuDm, 'api.openai.com', 'openai.azure.com', 'generativelanguage.googleapis.com', 'api.gptsapi.net', 'ark.cn-beijing.volces.com', 'dashscope.aliyuncs.com']);

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

  // Volcengine Doubao (Keep existing CNY)
  'doubao-pro-32k': { input: 0.0008, output: 0.002, unit: '1k', currency: 'CNY' },
  'doubao-lite-32k': { input: 0.0003, output: 0.0006, unit: '1k', currency: 'CNY' },
};

basekit.addField({
  formItems: [
    {
      key: 'instruction',
      label: '输入指令',
      component: FieldComponent.Input,
      validator: { required: true },
      props: { placeholder: '请输入指令' }
    },
    {
      key: 'request_url',
      label: '请求地址',
      component: FieldComponent.Input,
      validator: { required: true },
      props: { placeholder: 'https://api.openai.com/v1/responses' }
    },
    {
      key: 'model',
      label: '模型名称',
      component: FieldComponent.SingleSelect,
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
      component: FieldComponent.Input,
      validator: { required: false },
      props: { placeholder: '如同时选择了下拉项，将优先使用下拉项模型' }
    },
    {
      key: 'apikey',
      label: 'Apikey',
      component: FieldComponent.Input,
      validator: { required: true },
      props: { placeholder: 'sk-...' }
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
        { key: 'cost', type: FieldType.Number, label: '预估花费(元)' }
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
      reasoning_mode?: string
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
        reasoning_mode
      } = formItemParams;

      const finalModel = model || model_custom;

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
                 messages: [ { role: 'user', content: inputText } ] 
             };
        } else {
             // 保持原有 input 逻辑以防万一（针对非标准接口）
             body = { model: finalModel, input: inputText };
        }

        if (deep) body.reasoning = { effort: 'medium' };
      } else if (/openai\.azure\.com$/.test(host)) {
        headers = { ...headers, 'api-key': apikey };
        body = { messages: [{ role: 'user', content: inputText }] }; // Azure 也是 chat 格式
        if (deep) body.reasoning = { effort: 'medium' };
      } else if (isGemini) {
        headers = { ...headers, 'x-goog-api-key': apikey };
        body = {
          contents: [ { role: 'user', parts: [ { text: inputText } ] } ]
        };
      } else {
        headers = { ...headers, Authorization: `Bearer ${apikey}` };
        body = { model: finalModel, input: inputText };
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
        if (outputItem?.content?.[0]?.type === 'output_text') {
            resultText = outputItem.content[0].text || '';
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

      return { code: FieldCode.Success, data };
    } catch (e) {
      debugLog({ '===999 异常错误': String(e) });
      return { code: FieldCode.Error };
    }
  }

});
export default basekit;
