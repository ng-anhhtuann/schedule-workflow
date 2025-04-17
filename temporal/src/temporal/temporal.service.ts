/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from '@temporalio/client';
import { Worker } from '@temporalio/worker';
import { TEMPORAL_CONFIG } from './temporal.config';
import { UserService } from 'src/user.service';
import { scheduledWorkflow } from './temporal.workflow';

@Injectable()
export class TemporalService implements OnModuleInit {
  constructor(private userService: UserService) {}

  async onModuleInit() {
    await this.startWorker();
    await this.startWorkflow();
  }

  private async startWorker() {
    const worker = await Worker.create({
      workflowsPath: require.resolve('./temporal.workflow'),
      activities: {
        logMessage: async () => {
          const user = await this.userService.createRandomUser();
          console.log('_____Saved user to DB:', user);
        },
      },
      taskQueue: TEMPORAL_CONFIG.taskQueue,
    });
    void worker.run();
  }

  private async startWorkflow() {
    const workflowId = 'WORKFLOW_ID';

    const client = new Client({
      namespace: TEMPORAL_CONFIG.namespace,
    });

    try {
      const handle = client.workflow.getHandle(workflowId);
      await handle.terminate('Resetting workflow with new schedule');
      console.log('Terminated existing workflow:', workflowId);
    } catch (err) {
      console.warn('No existing workflow to terminate:', err);
    }

    await client.workflow.start(scheduledWorkflow, {
      taskQueue: TEMPORAL_CONFIG.taskQueue,
      workflowId: workflowId,
      cronSchedule: '50 10 * * *',
      workflowIdReusePolicy: 'ALLOW_DUPLICATE',
    });
  }
}
