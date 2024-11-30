const RSS = {
    education: 'https://www.edu.tw/Rss_News.aspx?n=9E7AC85F1954DDA8',
    executive: "https://www.ey.gov.tw/RSS_Content.aspx?ModuleType=3"
}
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
        textModel: "llama3",
        visionModel: "llava",
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
    RSS: RSS
};