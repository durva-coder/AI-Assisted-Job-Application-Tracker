// ============================================================================
// ORIGINAL OPENAI CODE - COMMENTED OUT
// ============================================================================
// import OpenAI from 'openai';
// import dotenv from 'dotenv';
// dotenv.config();
//
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });
//
// export const parseJobDescription = async (
//   jobDescription: string
// ): Promise<ParsedJobDescription> => {
//   try {
//     const response = await openai.chat.completions.create({
//       model: 'gpt-4o-mini',
//       ...
//     });
//     ...
//   } catch (error: any) {
//     ...
//   }
// };
//
// export const generateResumeSuggestions = async (
//   jobDescription: string,
//   role: string,
//   requiredSkills: string[]
// ): Promise<ResumeSuggestions> => {
//   try {
//     const response = await openai.chat.completions.create({
//       model: 'gpt-4o-mini',
//       ...
//     });
//     ...
//   } catch (error: any) {
//     ...
//   }
// };
// ============================================================================

// ============================================================================
// NEW GEMINI API IMPLEMENTATION
// ============================================================================
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Gemini API using OpenAI-compatible wrapper
const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/'
});

// Model to use
const GEMINI_MODEL = 'gemini-3-flash-preview';

export interface ParsedJobDescription {
  company: string;
  role: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  seniority: string;
  location: string;
}

export interface ResumeSuggestions {
  suggestions: string[];
}

export const parseJobDescription = async (
  jobDescription: string
): Promise<ParsedJobDescription> => {
  try {
    const response = await openai.chat.completions.create({
      model: GEMINI_MODEL,
      messages: [
        {
          role: 'system',
          content: `You are a job description parser. Extract the following information from the job description and return ONLY valid JSON. If a field cannot be determined, use an empty string for strings or empty array for arrays.

        Return ONLY a JSON object with this exact structure:
        {
          "company": "company name or empty string",
          "role": "job title/role or empty string",
          "requiredSkills": ["skill1", "skill2"],
          "niceToHaveSkills": ["skill1", "skill2"],
          "seniority": "entry/mid/senior/lead/staff or empty string",
          "location": "location or empty string"
        }`,
        },
        {
          role: 'user',
          content: jobDescription,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from Gemini API');
    }

    const parsed = JSON.parse(content) as ParsedJobDescription;

    // Validate structure
    if (
      typeof parsed.company !== 'string' ||
      typeof parsed.role !== 'string' ||
      !Array.isArray(parsed.requiredSkills) ||
      !Array.isArray(parsed.niceToHaveSkills) ||
      typeof parsed.seniority !== 'string' ||
      typeof parsed.location !== 'string'
    ) {
      throw new Error('Invalid response structure from Gemini API');
    }

    return parsed;
  } catch (error: any) {
    console.error('Error parsing job description:', error);

    // Check for Gemini API rate limit error (429)
    if (error.status === 429) {
      const errorMessage = error.error?.message || 'You exceeded your current quota';
      throw {
        status: 429,
        message: errorMessage,
        type: 'rate_limit'
      };
    }

    // Check for authentication error (401)
    if (error.status === 401) {
      throw {
        status: 401,
        message: 'Invalid Gemini API key. Please check your configuration.',
        type: 'auth_error'
      };
    }

    throw new Error('Failed to parse job description');
  }
};

export const generateResumeSuggestions = async (
  jobDescription: string,
  role: string,
  requiredSkills: string[]
): Promise<ResumeSuggestions> => {
  try {
    const skillsContext = requiredSkills.length > 0
      ? `Required skills: ${requiredSkills.join(', ')}`
      : '';

    const response = await openai.chat.completions.create({
      model: GEMINI_MODEL,
      messages: [
        {
          role: 'system',
          content: `You are a career coach and resume expert. Generate 3 to 5 specific, actionable resume bullet points tailored to this job role. Each bullet point should:
- Be specific to the role and company (not generic)
- Highlight relevant skills and experience that match the job requirements
- Use action verbs and quantify achievements where possible
- Be 1-2 lines each
- Follow the STAR method (Situation, Task, Action, Result) format

Return ONLY a JSON object with this exact structure:
{
  "suggestions": [
    "bullet point 1",
    "bullet point 2",
    "bullet point 3",
    "bullet point 4",
    "bullet point 5"
  ]
}`,
        },
        {
          role: 'user',
          content: `Role: ${role}\n${skillsContext}\n\nJob Description:\n${jobDescription}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from Gemini API');
    }

    const parsed = JSON.parse(content) as ResumeSuggestions;

    if (!Array.isArray(parsed.suggestions) || parsed.suggestions.length === 0) {
      throw new Error('Invalid response structure from Gemini API');
    }

    return parsed;
  } catch (error: any) {
    console.error('Error generating resume suggestions:', error);

    // Check for Gemini API rate limit error (429)
    if (error.status === 429) {
      const errorMessage = error.error?.message || 'You exceeded your current quota';
      throw {
        status: 429,
        message: errorMessage,
        type: 'rate_limit'
      };
    }

    // Check for authentication error (401)
    if (error.status === 401) {
      throw {
        status: 401,
        message: 'Invalid Gemini API key. Please check your configuration.',
        type: 'auth_error'
      };
    }

    throw new Error('Failed to generate resume suggestions');
  }
};
