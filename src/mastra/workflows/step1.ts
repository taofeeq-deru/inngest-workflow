import { Step, Workflow } from '@mastra/core/workflows'
import { z } from 'zod'

function getWeatherCondition(code: number): string {
  const conditions: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    95: 'Thunderstorm',
  }
  return conditions[code] || 'Unknown'
}

const forecastSchema = z.object({
  date: z.string(),
  maxTemp: z.number(),
  minTemp: z.number(),
  precipitationChance: z.number(),
  condition: z.string(),
  location: z.string(),
})

const fetchWeather = new Step({
  id: 'fetch-weather',
  description: 'Fetches weather forecast for a given city',
  outputSchema: forecastSchema,
  execute: async ({ context }) => {
    const triggerData: { city: string } = context.triggerData

    if (!triggerData) {
      throw new Error('Trigger data not found')
    }

    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(triggerData.city)}&count=1`
    const geocodingResponse = await fetch(geocodingUrl)
    const geocodingData = (await geocodingResponse.json()) as {
      results: { latitude: number; longitude: number; name: string }[]
    }

    if (!geocodingData.results?.[0]) {
      throw new Error(`Location '${triggerData.city}' not found`)
    }

    const { latitude, longitude, name } = geocodingData.results[0]

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=precipitation,weathercode&timezone=auto,&hourly=precipitation_probability,temperature_2m`
    const response = await fetch(weatherUrl)
    const data = (await response.json()) as {
      current: {
        time: string
        precipitation: number
        weathercode: number
      }
      hourly: {
        precipitation_probability: number[]
        temperature_2m: number[]
      }
    }

    const forecast = {
      date: new Date().toISOString(),
      maxTemp: Math.max(...data.hourly.temperature_2m),
      minTemp: Math.min(...data.hourly.temperature_2m),
      condition: getWeatherCondition(data.current.weathercode),
      location: name,
      precipitationChance: data.hourly.precipitation_probability.reduce(
        (acc, curr) => Math.max(acc, curr),
        0
      ),
    }

    return forecast
  },
})

const planActivities = new Step({
  id: 'plan-activities',
  description: 'Suggests activities based on weather conditions',
  inputSchema: forecastSchema,
  outputSchema: z.object({
    activities: z.string(),
  }),
  execute: async ({ context, mastra }) => {
    const forecast = context.getStepResult(fetchWeather)

    if (!forecast) {
      throw new Error('Forecast data not found')
    }

    const prompt = `Based on the following weather forecast for ${forecast.location}, suggest appropriate activities:
      ${JSON.stringify(forecast, null, 2)}
      `

    const agent = mastra?.getAgent('planningAgent')
    if (!agent) {
      throw new Error('Planning agent not found')
    }

    const response = await agent.stream([
      {
        role: 'user',
        content: prompt,
      },
    ])

    let activitiesText = ''

    for await (const chunk of response.textStream) {
      process.stdout.write(chunk)
      activitiesText += chunk
    }

    return {
      activities: activitiesText,
    }
  },
})

const weatherWorkflow = new Workflow({
  steps: [fetchWeather, planActivities],
  name: 'weather-workflow-step1-single-day',
  triggerSchema: z.object({
    city: z.string().describe('The city to get the weather for'),
  }),
})
  .step(fetchWeather)
  .then(planActivities)

weatherWorkflow.commit()

export { weatherWorkflow }
