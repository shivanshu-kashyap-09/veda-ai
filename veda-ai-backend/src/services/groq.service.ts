import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import { IAssignment } from '../models/Assignment';

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

export const generatePaperWithGroq = async (assignment: IAssignment): Promise<any> => {
  const model = process.env.GROQ_MODEL || 'mixtral-8x7b-32768';

  const typesStr = assignment.questionTypes
    .map((q) => `- ${q.numQuestions} questions of type '${q.type}' (each ${q.marks} marks)`)
    .join('\n');

  const systemPrompt = `You are an expert academic assessment creator. Your task is to generate a high-quality question paper based on the provided requirements.
You MUST output ONLY a valid JSON object matching the following structure, with no markdown formatting, no code blocks, and no extra text:
{
  "schoolName": "Delhi Public School",
  "subject": "General",
  "class": "10th",
  "timeAllowed": "45 minutes",
  "maxMarks": 20,
  "instructions": "All questions are compulsory unless stated otherwise.",
  "sections": [
    {
      "title": "Section A",
      "subtitle": "Multiple Choice Questions",
      "instruction": "Choose the correct option. Each question carries 1 mark.",
      "questions": [
        { "text": "[Easy] What is 2+2? (a) 3 (b) 4 (c) 5 (d) 6", "difficulty": "Easy", "marks": 1 }
      ]
    }
  ],
  "answerKey": [
    "1. (b) 4"
  ]
}

Ensure the questions are grouped logically into sections. Add difficulty tags like [Easy], [Moderate], [Challenging] to the question text if appropriate, and include the marks.`;

  const userPrompt = `Please generate an assessment with the following requirements:
Title: ${assignment.title}
Due Date: ${assignment.dueDate}

Question Requirements:
${typesStr}

Additional Instructions:
${assignment.additionalInfo || 'None'}

Remember, output strictly valid JSON.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      model: model,
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No content returned from Groq');
    }

    return JSON.parse(responseContent);
  } catch (error) {
    console.error('Groq generation error:', error);
    throw error;
  }
};
