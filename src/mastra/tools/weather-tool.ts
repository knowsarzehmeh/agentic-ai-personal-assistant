import { createTool } from "@mastra/core/tools";
import { z } from "zod";


function weatherCodeToDescription(code: number): string {
    switch (code) {
        case 0:
            return "Clear sky";
        case 1:
            return "Mainly clear";
        case 2:
            return "Partly cloudy";
        case 3:
            return "Overcast";
        case 45:
            return "Fog";
        case 48:
            return "Depositing rime fog";
        case 51:
            return "Light drizzle";
        case 53:
            return "Moderate drizzle";
        case 55:
            return "Dense drizzle";
        case 56:
            return "Light freezing drizzle";
        case 57:
            return "Dense freezing drizzle";
        case 61:
            return "Light rain";
        case 63:
            return "Moderate rain";
        case 65:
            return "Heavy rain";
        case 66:
            return "Light freezing rain";
        case 67:
            return "Heavy freezing rain";
        case 71:
            return "Light snow fall";
        case 73:
            return "Moderate snow fall";
        case 75:
            return "Heavy snow fall";
        case 77:
            return "Snow grains";
        case 80:
            return "Light rain showers";
        case 81:
            return "Moderate rain showers";
        case 82:
            return "Violent rain showers";
        case 83:
            return "Light freezing rain showers";
        case 84:
            return "Moderate freezing rain showers";
        case 85:
            return "Heavy freezing rain showers";
        case 86:
            return "Light snow showers";
        case 87:
            return "Moderate snow showers";
        case 88:
            return "Heavy snow showers";
        case 95:
            return "Thunderstorm";
        case 96:
            return "Thunderstorm with light hail";
        case 99:
            return "Thunderstorm with heavy hail";
        default:
            return "Unknown";
    }

}

export const weatherTool = createTool({
    id: "get-weather",
    description: "Get current weatther for a city including temperature",
    inputSchema: z.object({
        city: z.string().describe("The city to get the weather for"),

    }),
    outputSchema: z.object({
        city: z.string().describe("The city name"),
        temperature: z.number().describe("The current temperature in Celsius"),
        condition: z.string().describe("A short description of the weather"),
        error: z.string().optional().describe("An error message if the weather could not be retrieved"),
    }),

    execute: async ({ city }) => {
        console.log("input", city);

        try {
            const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
            const geoData = await geoResponse.json() as {
                results?: Array<{
                    name: string;
                    latitude: number;
                    longitude: number;
                }>;
            };
            if (!geoData.results || geoData.results.length === 0) {
                return {
                    city,
                    temperature: 0,
                    condition: "",
                    error: "Could not find city"

                };
            }
            const latitude = geoData.results[0].latitude;
            const longitude = geoData.results[0].longitude;
            const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
            const weatherData = await weatherResponse.json() as {
                current_weather: {
                    temperature: number;
                    weathercode: number;
                };
            };
            return {
                temperature: weatherData.current_weather.temperature,
                condition: weatherCodeToDescription(weatherData.current_weather.weathercode),
                city

            };
        } catch (error) {
            return {
                temperature: 0,
                condition: "Unavailable",
                city,
                error: "Could not get weather data"
            };
        }
    }

})