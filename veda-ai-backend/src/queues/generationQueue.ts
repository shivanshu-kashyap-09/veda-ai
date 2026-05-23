import { Queue } from 'bullmq';
import { redisClient } from '../config/redis';

export const generationQueue = new Queue('paperGeneration', {
  connection: redisClient,
});

export const addGenerationJob = async (assignmentId: string) => {
  const job = await generationQueue.add(
    'generate-paper',
    { assignmentId },
    { attempts: 3, backoff: { type: 'exponential', delay: 1000 } }
  );
  return job;
};
