import { Mastra } from "@mastra/core";
import { personalAssistantAgent } from "./agents/personal-assistant";
import { DuckDBStore } from "@mastra/duckdb";
import { MastraCompositeStore } from "@mastra/core/storage";
import { LibSQLStore } from "@mastra/libsql";
import { MastraPlatformExporter, MastraStorageExporter, Observability } from "@mastra/observability";

const observabilityStore = await new DuckDBStore().getStore('observability')

export const mastra = new Mastra({
    storage: new MastraCompositeStore({
        id: "composite-store",
        default: new LibSQLStore({
            id: 'mastra-storage',
            url: 'file:./mastra.db',
        }),
        domains: {
            observability: observabilityStore
        }
    }),
    observability: new Observability({
        configs: {
            default: {
                serviceName: 'agentic-ai-personal-assistant',
                exporters: [
                    new MastraStorageExporter(),
                    new MastraPlatformExporter()
                ]
            }
        }
    }),
    agents: {
        personalAssistantAgent
    },
});