import { Step, Workflow } from '@mastra/core/workflows'
import { z } from 'zod'

const generateSuggestionsStep = new Step({
  id: 'generate-suggestions',
  outputSchema: z.object({
    suggestions: z.array(z.string()),
  }),
  execute: async ({ context, mastra }) => {
    if (!mastra) {
      throw new Error('Mastra is not initialized')
    }

    const { vacationDescription } = context?.getStepResult('trigger')
    const result = await mastra.getAgent('summaryTravelAgent').generate([
      {
        role: 'user',
        content: vacationDescription,
      },
    ])
    console.log(result.text)
    return { suggestions: JSON.parse(result.text) }
  },
})

const humanInputStep = new Step({
  id: 'human-input',
  inputSchema: z.object({
    selection: z.string().optional().describe('The selection of the user'),
  }),
  outputSchema: z.object({
    selection: z.string().optional().describe('The selection of the user'),
  }),
  execute: async ({ context, suspend }) => {
    const { inputData } = context
    if (!inputData?.selection) {
      await suspend()
    }
    return { selection: inputData?.selection }
  },
})

const travelPlannerStep = new Step({
  id: 'travel-planner',
  outputSchema: z.object({
    travelPlan: z.string(),
  }),
  execute: async ({ context, mastra }) => {
    const travelAgent = mastra?.getAgent('travelAgent')
    if (!travelAgent) {
      throw new Error('Travel agent is not initialized')
    }

    const { selection } = context?.getStepResult('human-input')
    const { vacationDescription } = context?.getStepResult('trigger')
    const result = await travelAgent.generate([
      { role: 'assistant', content: vacationDescription },
      { role: 'user', content: selection },
    ])
    console.log(result.text)
    return { travelPlan: result.text }
  },
})

const travelAgentWorkflow = new Workflow({
  name: 'travel-agent-workflow-step4-suspend-resume',
  triggerSchema: z.object({
    vacationDescription: z.string().describe('The description of the vacation'),
  }),
})
  .step(generateSuggestionsStep)
  .then(humanInputStep)
  .then(travelPlannerStep)

travelAgentWorkflow.commit()

export { travelAgentWorkflow as weatherWorkflow }
