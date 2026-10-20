import { Agent } from "@mastra/core/agent";
import { personalAssistantInstructions } from "./instructions";
import { weatherTool } from "../tools/weather-tool";
import { saveNoteTool } from "../tools/note-tool";
import { Memory } from "@mastra/memory";

export const personalAssistantAgent = new Agent({
    id: 'personal-assistant',
    name: 'Personal Assistant',
    description: 'A helpful personal assistant that can answer questions and help with tasks.',
    model: 'google/gemini-flash-lite-latest',
    instructions: personalAssistantInstructions,
    tools: {
        getWeather: weatherTool,
        saveNote: saveNoteTool
    },
    memory: new Memory({
        options: {
            lastMessages: 20
        }
    })
})
