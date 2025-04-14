import { Mastra } from '@mastra/core/mastra'
import { createLogger } from '@mastra/core/logger'
import { weatherWorkflow } from './workflows'
import { weatherWorkflow as step1Workflow } from './workflows/step1'
import { weatherWorkflow as step2Workflow } from './workflows/step2'
import { weatherWorkflow as step3Workflow } from './workflows/step3'
import { weatherWorkflow as step4Workflow } from './workflows/step4'
import { weatherAgent, synthesizeAgent, activityPlannerAgent } from './agents'
import { summaryAgent, travelAgent } from './agents/travelAgent'
import { planningAgent } from './agents/planning'
import { incrementWorkflow as step5Workflow } from './workflows/step5'
import { researchAgent, factCheckAgent, editorAgent } from './agents/network'

export const mastra = new Mastra({
  // workflows: {
  //   weatherWorkflow,
  //   step1Workflow,
  //   step2Workflow,
  //   step3Workflow,
  //   step4Workflow,
  //   step5Workflow,
  // },
  newWorkflows: {
    step1Workflow,
    step2Workflow,
    step3Workflow,
    step4Workflow,
    step5Workflow,
  },
  agents: {
    activityPlannerAgent,
    weatherAgent,
    summaryTravelAgent: summaryAgent,
    travelAgent,
    planningAgent,
    synthesizeAgent,
    researchAgent,
    factCheckAgent,
    editorAgent,
  },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
})
