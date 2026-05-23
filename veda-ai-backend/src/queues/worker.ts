import { Worker } from 'bullmq';
import { redisClient } from '../config/redis';
import { Assignment } from '../models/Assignment';
import { GeneratedPaper } from '../models/GeneratedPaper';
import { generatePaperWithGroq } from '../services/groq.service';
import { broadcastToRoom } from '../websocket/socketServer';

export const initWorker = () => {
  const worker = new Worker(
    'paperGeneration',
    async (job) => {
      const { assignmentId } = job.data;
      console.log(`Processing generation for assignment: ${assignmentId}`);

      // 1. Fetch assignment
      const assignment = await Assignment.findById(assignmentId);
      if (!assignment) {
        throw new Error(`Assignment not found: ${assignmentId}`);
      }

      // Update status to processing
      assignment.status = 'processing';
      await assignment.save();
      
      // Notify client (progress 10%)
      broadcastToRoom(assignmentId, 'jobProgress', { jobId: job.id, progress: 10, status: 'processing' });

      try {
        // 2. Call AI Service
        broadcastToRoom(assignmentId, 'jobProgress', { jobId: job.id, progress: 40, status: 'generating' });
        const paperData = await generatePaperWithGroq(assignment);
        
        broadcastToRoom(assignmentId, 'jobProgress', { jobId: job.id, progress: 80, status: 'saving' });

        // 3. Save generated paper
        const generatedPaper = new GeneratedPaper({
          assignmentId: assignment._id,
          schoolName: paperData.schoolName || 'Delhi Public School',
          subject: paperData.subject || assignment.title,
          class: paperData.class || '10th',
          timeAllowed: paperData.timeAllowed || '45 minutes',
          maxMarks: paperData.maxMarks || 20,
          instructions: paperData.instructions || 'All questions are compulsory.',
          sections: paperData.sections || [],
          answerKey: paperData.answerKey || [],
        });

        await generatedPaper.save();

        // 4. Update assignment status
        assignment.status = 'completed';
        await assignment.save();

        // 5. Notify client completion
        broadcastToRoom(assignmentId, 'generationDone', { jobId: job.id, progress: 100, paper: generatedPaper });

        console.log(`Successfully generated paper for assignment: ${assignmentId}`);
        return generatedPaper;
      } catch (error: any) {
        console.error(`Error generating paper for ${assignmentId}:`, error);
        
        assignment.status = 'failed';
        await assignment.save();
        
        broadcastToRoom(assignmentId, 'error', { jobId: job.id, message: error.message });
        throw error;
      }
    },
    { connection: redisClient }
  );

  worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed with error:`, err.message);
  });

  return worker;
};
