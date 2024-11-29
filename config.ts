const agent = {
    useModel: "gemini",//main model.Input:gemnni,ollama,gork,opeani ,required
    //if u aren't use this model u can don't change the value
    gemini: {
        textModel: "gemini-1.5-flash",
        visionModel: "gemini-1.5-flash",
        apikey: process.env.gemini_apikey || "",
        base_url: "https://generativelanguage.googleapis.com/v1beta/openai/"
    },
    ollama: {
        textModel: "qwen2.5-coder:32b",
        visionModel: "llava",
        apikey: process.env.ollama_apikey || "ollama",
        base_url: "https://5eb4-34-132-94-102.ngrok-free.app/v1"
    },
    grok: {
        textModel: "grok-beta",
        visionModel: "",
        apikey: process.env.grok_apikey || "",
        base_url: "https://api.x.ai"
    },
    openai: {
        textModel: "",
        visionModel: "",
        apikey: process.env.openai_apikey || "",
        base_url: ""
    }
}
const modelConfig = agent[agent.useModel as keyof typeof agent];
// 函數：取得當前模型設定
function getCurrentConfig() {
    const currentModel = agent.useModel as keyof typeof agent;
    return agent[currentModel];
}
const supportModel = [
    "grok",
    "gemini",
    "openai",
    "ollama"
]
export default {
    agent: agent,
    models: supportModel,
    modelConfig: getCurrentConfig(),
};