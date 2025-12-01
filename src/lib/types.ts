export type InterviewQuestion = {
  id: string;
  question: string;
  userAnswer?: string;
  videoUrl?: string;
  feedback?: QuestionFeedback;
};

export type QuestionFeedback = {
  score: number;
  strengths: string;
  weaknesses: string;
  improvementSuggestions: string;
  bodyLanguageFeedback?: string;
};

export type InterviewSession = {
  id: string;
  date: string;
  jobRole: string;
  industry: string;
  overallScore: number;
  questions: InterviewQuestion[];
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  educationLevel?: string;
  targetJobRole?: string;
  targetIndustry?: string;
  experienceLevel?: number;
  careerGoals?: string;
};
