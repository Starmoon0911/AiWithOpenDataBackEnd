const agent = {
    useModel: "ollama",//main model.Input:gemnni,ollama,gork,opeani ,required
    //if u aren't use this model u can don't change the value
    gemini: {
        textModel: "",
        visionModel: "",
        apikey: process.env.gemini_apikey || "",
        base_url: ""
    },
    ollama: {
        textModel: "llama3",
        visionModel: "",
        apikey: process.env.ollama_apikey || "ollama",
        base_url: "http://localhost:11434/v1"
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