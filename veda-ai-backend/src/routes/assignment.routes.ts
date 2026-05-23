import { Router } from 'express';
import { createAssignment, getAssignmentWithPaper, getAssignments, deleteAssignment } from '../controllers/assignment.controller';

const router = Router();

router.post('/', createAssignment);
router.get('/', getAssignments);
router.get('/:id', getAssignmentWithPaper);
router.delete('/:id', deleteAssignment);

export default router;
