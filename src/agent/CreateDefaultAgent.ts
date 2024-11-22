import { OpenAI } from 'openai';
import config from '../../config';
import urlToBase64 from '../lib/url2base64';

interface Props {
    prompt?: string;
    _model?: string;
}

interface InvokeParams {
    prompt: string;
    systemPrompt: string;
    imgUrl?: string;
}
function limitedLog(message, maxLength = 100) {
    if (typeof message !== 'string') {
        message = String(message);
    }
    if (message.length > maxLength) {
        message = message.slice(0, maxLength) + '...';
    }
    console.log(message);
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
            let messages;
            if (imgUrl) {
                try {
                    imageBase64 = await (await urlToBase64(imgUrl)).replace(' charset=utf-8;', '');
                    console.log(limitedLog(imageBase64, 100))
                    console.log("Image successfully converted to Base64");
                } catch (error) {
                    console.error("Failed to convert image URL to Base64:", error);
                    throw new Error("Image conversion failed");
                }
            }
            if (imageBase64) {
                messages = [
                    {
                        role: "system",
                        content: systemPrompt,
                    },
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: prompt,
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    "url": `${imageBase64}`
                                },
                            }
                        ],
                    },
                ];

            } else {
                messages = [
                    {
                        role: "system",
                        content: systemPrompt,
                    },
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: prompt,
                            }
                        ],
                    },
                ]
            }

            const response = await this.llm.chat.completions.create({
                model: this.model,
                messages,
            });

            return response;
        } catch (error) {
            console.error("Error invoking LLM:", error);
            throw error;
        }
    }

}
