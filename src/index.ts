import { createHonoServer } from '@mastra/deployer/server'
import { mastra } from './mastra'
import { createInterface } from 'readline'
import { humanInputStep } from './mastra/workflows/step4'
import { serve } from '@hono/node-server'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 4111

const readInput = (): Promise<string> => {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question('', (answer) => {
      rl.close()
      resolve(answer)
    })
  })
}

// Example 1
// const workflow = mastra.getWorkflow('step1Workflow')
// const run = workflow.createRun({})
// const result = await run.start({ inputData: { city: 'New York' } })
// if (result.status === 'success') {
//   const planActivities = result.steps['plan-activities']
//   if (planActivities.status === 'success') {
//     console.log(planActivities.output?.activities)
//   }
// }
// console.dir(result, { depth: null })

// Example 2
// const workflow = mastra.getWorkflow('step2Workflow')
// const run = workflow.createRun({})
// const result = await run.start({ inputData: { city: 'New York' } })
// console.dir(result, { depth: null })

// Example 3
// const workflow = mastra.getWorkflow('step3Workflow')
// const run = workflow.createRun({})
// const result = await run.start({ inputData: { city: 'New York' } })
// console.dir(result, { depth: null })

// Example 4
// const workflow = mastra.getWorkflow('step4Workflow')
// const run = workflow.createRun({})
// const result = await run.start({
//   inputData: { vacationDescription: 'I want to go to the beach' },
// })
// console.log('result', result)
// const suggStep = result?.steps?.['generate-suggestions']
// if (suggStep.status === 'success') {
//   const suggestions = suggStep.output?.suggestions
//   console.log(
//     suggestions
//       .map(({ location, description }) => `- ${location}: ${description}`)
//       .join('\n')
//   )

//   const userInput = await readInput()
//   console.log('Selected:', userInput)

//   console.log('resuming from', result, 'with', {
//     inputData: {
//       selection: userInput,
//       vacationDescription: 'I want to go to the beach',
//       suggestions: suggStep?.output?.suggestions,
//     },
//     step: humanInputStep,
//   })
//   const result2 = await run.resume({
//     resumeData: {
//       selection: userInput,
//       vacationDescription: 'I want to go to the beach',
//       suggestions: suggStep?.output?.suggestions,
//     },
//     step: humanInputStep,
//   })
//   console.dir(result2, { depth: null })
// }

// Example 5
// const workflow = mastra.getWorkflow('step5Workflow')
// const run = workflow.createRun({})
// const result = await run.start({ inputData: { value: 5 } })
// console.dir(result, { depth: null })

// Example 6

const app = await createHonoServer(mastra)

const srv = serve({
  fetch: app.fetch,
  port: 4111,
})

const workflow = mastra.getWorkflow('step6Workflow')
const run = workflow.createRun({})
const result = await run.start({ inputData: { city: 'New York' } })
console.dir(result, { depth: null })

srv.close()
