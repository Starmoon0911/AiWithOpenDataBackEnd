const agent = {
    useModel: "ollama",//main model.Input:gemnni,ollama,gork,opeani ,required
    //if u aren't use this model u can don't change the value
    gemini: {
        model: "",
        apikey: process.env.gemini_apikey || "",
        base_url: ""
    },
    ollama: {
        model: "llama3",
        apikey: process.env.ollama_apikey || "ollama",
        base_url: "http://localhost:11434/v1"
    },
    grok: {
        model: "grok-beta",
        apikey: process.env.grok_apikey || "",
        base_url: "https://api.x.ai"
    },
    openai: {
        model: "",
        apikey: process.env.openai_apikey || "",
        base_url: ""
    }
}
const modelConfig = agent[agent.useModel as keyof typeof agent];

const supportModel = [
    "grok",
    "gemini",
    "openai",
    "ollama"
]
export default { agent, supportModel, modelConfig };
