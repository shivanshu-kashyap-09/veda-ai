import { Request, Response } from 'express';
import { Assignment } from '../models/Assignment';
import { GeneratedPaper } from '../models/GeneratedPaper';
import { addGenerationJob } from '../queues/generationQueue';

export const createAssignment = async (req: Request, res: Response) => {
  try {
    const { title, dueDate, questionTypes, additionalInfo } = req.body;

    if (!dueDate || !questionTypes || questionTypes.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const assignment = new Assignment({
      title,
      dueDate,
      questionTypes,
      additionalInfo,
    });

    await assignment.save();

    // Kick off background job
    const job = await addGenerationJob(assignment._id.toString());

    res.status(201).json({
      message: 'Assignment created and generation started',
      assignmentId: assignment._id,
      jobId: job.id,
    });
  } catch (error: any) {
    console.error('Error in createAssignment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAssignmentWithPaper = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const paper = await GeneratedPaper.findOne({ assignmentId: id });

    res.status(200).json({
      assignment,
      paper,
    });
  } catch (error: any) {
    console.error('Error in getAssignment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAssignments = async (req: Request, res: Response) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    res.status(200).json(assignments);
  } catch (error: any) {
    console.error('Error in getAssignments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteAssignment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Delete the assignment
    await Assignment.findByIdAndDelete(id);

    // Also delete any associated generated paper
    await GeneratedPaper.findOneAndDelete({ assignmentId: id });

    res.status(200).json({ message: 'Assignment deleted successfully' });
  } catch (error: any) {
    console.error('Error in deleteAssignment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
