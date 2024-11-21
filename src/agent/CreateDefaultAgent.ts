import { OpenAI } from 'openai';
import config from '../../config';
import urlToBase64 from '../utils/url2base64';

interface Props {
    prompt?: string;
    _model?: string;
}

interface InvokeParams {
    prompt: string;
    systemPrompt: string;
    imgUrl?: string;
}

export class DefaultAgent {
    private llm: OpenAI;
    private model: string;

    constructor({ _model }: { _model?: string }) {
        const { modelConfig } = config;
        const { model, apikey, base_url } = modelConfig as {
            model: string;
            apikey: string;
            base_url: string;
        };

        this.model = _model || model;
        this.llm = new OpenAI({
            apiKey: apikey,
            baseURL: base_url,
        });

        console.log(`LLM created for model: ${this.model}`);
    }

    async invoke({ prompt, systemPrompt, imgUrl }: InvokeParams) {
        try {
            let imageBase64: string | undefined;

            if (imgUrl) {
                try {
                    imageBase64 = await urlToBase64(imgUrl);
                    console.log('Image successfully converted to Base64');
                } catch (error) {
                    console.error('Failed to convert image URL to Base64:', error);
                    throw new Error('Image conversion failed');
                }
            }

            const messages: Array<{ role: 'system' | 'user'; content: string }> = [
                {
                    role: 'system',
                    content: systemPrompt,
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ];

            // 如果有圖片，加入至 messages
            if (imageBase64) {
                messages.push({
                    role: 'user',
                    content: `Here is an image in Base64 format: ${imageBase64}`,
                });
            }

            const response = await this.llm.chat.completions.create({
                model: this.model,
                messages,
            });

            return response;
        } catch (error) {
            console.error('Error invoking LLM:', error);
            throw error;
        }
    }
}
