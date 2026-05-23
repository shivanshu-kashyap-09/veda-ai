import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestionType {
  type: string;
  numQuestions: number;
  marks: number;
}

export interface IAssignment extends Document {
  title: string;
  dueDate: string;
  questionTypes: IQuestionType[];
  additionalInfo: string;
  fileUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const QuestionTypeSchema = new Schema({
  type: { type: String, required: true },
  numQuestions: { type: Number, required: true },
  marks: { type: Number, required: true },
});

const AssignmentSchema = new Schema(
  {
    title: { type: String, required: true, default: 'Untitled Assignment' },
    dueDate: { type: String, required: true },
    questionTypes: { type: [QuestionTypeSchema], required: true },
    additionalInfo: { type: String, default: '' },
    fileUrl: { type: String },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const Assignment = mongoose.model<IAssignment>('Assignment', AssignmentSchema);
