import { Mastra } from '@mastra/core/mastra'
import { createLogger } from '@mastra/core/logger'
import { weatherWorkflow } from './workflows'
import { weatherWorkflow as step1Workflow } from './workflows/step1'
import { weatherWorkflow as step2Workflow } from './workflows/step2'
import { weatherWorkflow as step3Workflow } from './workflows/step3'
import { weatherWorkflow as step4Workflow } from './workflows/step4'
import {
  weatherAgent,
  synthesizeAgent,
  activityPlannerAgent,
  weatherReporterAgent,
} from './agents'
import { summaryAgent, travelAgent } from './agents/travelAgent'
import { planningAgent } from './agents/planning'
import { incrementWorkflow as step5Workflow } from './workflows/step5'
import { researchAgent, factCheckAgent, editorAgent } from './agents/network'
import { weatherWorkflow as step6Workflow } from './workflows/step6'

export const mastra = new Mastra({
  // workflows: {
  //   weatherWorkflow,
  //   step1Workflow,
  //   step2Workflow,
  //   step3Workflow,
  //   step4Workflow,
  //   step5Workflow,
  // },
  vnext_workflows: {
    step1Workflow,
    step2Workflow,
    step3Workflow,
    step4Workflow,
    step5Workflow,
    step6Workflow,
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
    weatherReporterAgent,
  },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
})
