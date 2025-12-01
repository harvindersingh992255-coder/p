'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/personalized-practice-recommendations.ts';
import '@/ai/flows/body-language-analysis.ts';
import '@/ai/flows/ai-performance-feedback.ts';
import '@/ai/flows/generate-interview-questions.ts';
import '@/ai/flows/resume-analyzer.ts';
import '@/ai/flows/text-to-speech.ts';
import '@/ai/flows/confidence-coach.ts';
