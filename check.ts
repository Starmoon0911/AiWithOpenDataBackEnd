import config from './config';

const runCheck = () => {
    const MainModel = config.agent.useModel;
    if (!config.supportModel.includes(MainModel)) {
        throw '"useModel" must be one of: grok, gemini, openai, ollama';
    }
    const modelConfig = config.agent[MainModel as keyof typeof config.agent];

    if (!modelConfig || typeof modelConfig !== 'object') {
        throw `Configuration for "${MainModel}" is missing or incorrect.`;
    }
    const { apikey, base_url,model } = modelConfig;

    console.log(`Model: ${MainModel}:${model}, API Key: ${apikey}, Base URL: ${base_url}`);
};

export default runCheck;
