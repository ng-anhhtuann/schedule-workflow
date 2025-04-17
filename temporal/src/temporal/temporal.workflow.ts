import { proxyActivities } from '@temporalio/workflow';

const { logMessage } = proxyActivities<{
  logMessage(): Promise<void>;
}>({
  startToCloseTimeout: '45s',
});

export async function SaveUserWorkflow(): Promise<void> {
  await logMessage();
}

export const scheduledWorkflow = SaveUserWorkflow;
