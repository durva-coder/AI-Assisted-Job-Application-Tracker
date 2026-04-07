import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import {
  parseJobDescription,
  generateResumeSuggestions,
} from '../services/openai.js';

const router = Router();

router.use(authMiddleware);

router.post(
  '/parse-jd',
  [body('jobDescription').trim().notEmpty().withMessage('Job description is required')],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { jobDescription } = req.body;

      const parsed = await parseJobDescription(jobDescription);

      res.json({ parsed });
    } catch (error: any) {
      console.error('Parse JD error:', error);
      
      // Handle rate limit errors
      if (error.type === 'rate_limit') {
        return res.status(429).json({ 
          error: 'OpenAI API rate limit exceeded',
          message: error.message,
          type: 'rate_limit'
        });
      }
      
      // Handle authentication errors
      if (error.type === 'auth_error') {
        return res.status(500).json({ 
          error: 'OpenAI API configuration error',
          message: error.message,
          type: 'auth_error'
        });
      }
      
      res.status(500).json({ error: 'Failed to parse job description' });
    }
  }
);

router.post(
  '/resume-suggestions',
  [
    body('jobDescription').trim().notEmpty().withMessage('Job description is required'),
    body('role').trim().notEmpty().withMessage('Role is required'),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { jobDescription, role, requiredSkills } = req.body;

      const suggestions = await generateResumeSuggestions(
        jobDescription,
        role,
        requiredSkills || []
      );

      res.json({ suggestions: suggestions.suggestions });
    } catch (error: any) {
      console.error('Resume suggestions error:', error);
      
      // Handle rate limit errors
      if (error.type === 'rate_limit') {
        return res.status(429).json({ 
          error: 'OpenAI API rate limit exceeded',
          message: error.message,
          type: 'rate_limit'
        });
      }
      
      // Handle authentication errors
      if (error.type === 'auth_error') {
        return res.status(500).json({ 
          error: 'OpenAI API configuration error',
          message: error.message,
          type: 'auth_error'
        });
      }
      
      res.status(500).json({ error: 'Failed to generate resume suggestions' });
    }
  }
);

export { router as aiRouter };
