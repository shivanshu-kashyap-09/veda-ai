import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion {
  text: string;
  difficulty?: string;
  marks?: number;
}

export interface ISection {
  title: string;
  subtitle?: string;
  instruction?: string;
  questions: IQuestion[];
}

export interface IGeneratedPaper extends Document {
  assignmentId: mongoose.Types.ObjectId;
  schoolName: string;
  subject: string;
  class: string;
  timeAllowed: string;
  maxMarks: number;
  instructions: string;
  sections: ISection[];
  answerKey: string[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema({
  text: { type: String, required: true },
  difficulty: { type: String },
  marks: { type: Number },
});

const SectionSchema = new Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  instruction: { type: String },
  questions: { type: [QuestionSchema], required: true },
});

const GeneratedPaperSchema = new Schema(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
      unique: true,
    },
    schoolName: { type: String, default: 'Delhi Public School' },
    subject: { type: String, default: 'General' },
    class: { type: String, default: '10th' },
    timeAllowed: { type: String, default: '45 minutes' },
    maxMarks: { type: Number, default: 20 },
    instructions: { type: String, default: 'All questions are compulsory unless stated otherwise.' },
    sections: { type: [SectionSchema], required: true },
    answerKey: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const GeneratedPaper = mongoose.model<IGeneratedPaper>('GeneratedPaper', GeneratedPaperSchema);
