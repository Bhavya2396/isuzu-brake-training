import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY || '');

const SYSTEM_PROMPT = `You are an expert automotive technician trainer specializing in brake systems. You're helping technicians learn brake pad replacement through an interactive training module.

Your personality:
- Friendly but professional
- Safety-focused (always emphasize safety)
- Practical and hands-on approach
- Patient with beginners, encouraging with questions

Guidelines:
- Keep responses concise (2-4 sentences for simple questions, more for complex topics)
- Always mention safety considerations when relevant
- Use simple, clear language without unnecessary jargon
- If asked about something dangerous, refuse and explain why
- Reference the current training step context when provided
- Provide actionable, practical advice

You're part of an interactive brake pad replacement training module with these steps:
1. Wheel Removal
2. Access Brake Caliper
3. Remove Old Brake Pads
4. Install New Brake Pads
5. Reassembly
6. Post-Installation Checks`;

export interface AskTrainerParams {
  userMessage: string;
  context?: string;
  currentStep?: string;
}

export async function askAITrainer({
  userMessage,
  context,
  currentStep
}: AskTrainerParams): Promise<string> {
  if (!API_KEY) {
    return "AI Trainer is not configured. Please add your Gemini API key to the .env file.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    let fullPrompt = SYSTEM_PROMPT;
    
    if (currentStep) {
      fullPrompt += `\n\nCurrent training step: ${currentStep}`;
    }
    
    if (context) {
      fullPrompt += `\n\nAdditional context: ${context}`;
    }
    
    fullPrompt += `\n\nTechnician's question: ${userMessage}\n\nRespond helpfully and concisely:`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    if (error instanceof Error) {
      if (error.message.includes('API_KEY')) {
        return "Invalid API key. Please check your Gemini API key in the .env file.";
      }
      if (error.message.includes('quota') || error.message.includes('rate')) {
        return "Rate limit reached. Please wait a moment and try again.";
      }
    }
    return "I'm having trouble connecting right now. Please try again in a moment.";
  }
}

export async function getContextualTip(stepContext: string): Promise<string> {
  if (!API_KEY) {
    return "";
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `You're a brake service trainer. Give ONE practical pro tip (1-2 sentences max) for this situation: ${stepContext}. Be specific and actionable.`;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini tip error:', error);
    return '';
  }
}

export const quickSuggestions = [
  "What tools do I need for this step?",
  "Why is this step important?",
  "What's the most common mistake here?",
  "Is this safe to do?",
  "Explain this in more detail"
];

export const stepContextMap: Record<string, string> = {
  landing: "Starting brake pad replacement training",
  objectives: "Reviewing learning objectives for brake pad replacement",
  context: "Understanding brake system components",
  safety: "Pre-work safety checklist for brake service",
  tools: "Reviewing required tools for brake pad replacement",
  step1: "Wheel removal - loosening lug nuts and removing the wheel",
  step2: "Accessing the brake caliper - removing mounting bolts",
  step3: "Removing old brake pads - inspection and removal",
  step4: "Installing new brake pads - correct orientation and seating",
  step5: "Reassembly - reinstalling caliper and wheel",
  postInstall: "Post-installation checks - pedal test and inspection",
  quiz: "Knowledge assessment on brake pad replacement",
  complete: "Training completion and certification"
};
