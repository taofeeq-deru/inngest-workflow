import { Step, Workflow } from '@mastra/core/workflows'
import { z } from 'zod'

const incrementStep = new Step({
  id: 'increment',
  outputSchema: z.object({
    value: z.number(),
  }),
  execute: async ({ context }) => {
    const value: { value: number } =
      context.getStepResult('increment') ?? context.triggerData
    return { value: value.value + 1 }
  },
})

const finalStep = new Step({
  id: 'final',
  outputSchema: z.object({
    value: z.number(),
    start: z.number(),
  }),
  execute: async ({ context }) => {
    const value = context.getStepResult(incrementStep)
    const start: { value: number } = context.triggerData
    return { value: value.value, start: start.value }
  },
})

const workflow = new Workflow({
  name: 'increment-workflow',
  triggerSchema: z.object({
    value: z.number(),
  }),
})
  .step(incrementStep)
  .until(
    {
      ref: { step: incrementStep, path: 'value' },
      query: { $gte: 10 },
    },
    incrementStep
  )
  .then(finalStep)

workflow.commit()

export { workflow as incrementWorkflow }
