import { OpenAI } from 'openai';
import config from '../../config';

export default async function createDefaultAgent() {
    const { agent, modelConfig } = config;
    const { model, apikey, base_url } = modelConfig as {
        model: string;
        apikey: string;
        base_url: string;
    };

    const llm = new OpenAI({
        apiKey: apikey,
        baseURL: base_url
    });
    console.log(`LLM created for model: ${model}`);
    return llm;
}