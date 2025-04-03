import { openai } from '@ai-sdk/openai'
import { Agent } from '@mastra/core/agent'

export const researchAgent = new Agent({
  name: 'researchAgent',
  model: openai('gpt-4o'),
  instructions: `You are a research agent. You are given a prompt and you need to research for an answer.`,
})

export const factCheckAgent = new Agent({
  name: 'factCheckAgent',
  model: openai('gpt-4o'),
  instructions: `You are a fact check agent. You are given a prompt and you need to fact check the prompt.`,
})

export const editorAgent = new Agent({
  name: 'editorAgent',
  model: openai('gpt-4o'),
  instructions: `You are an editor agent. You write great content.`,
})
