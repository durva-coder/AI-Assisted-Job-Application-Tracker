import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { Application, IApplication, ApplicationStatus } from '../models/Application.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const applications = await Application.find({ user: req.userId })
      .sort({ createdAt: -1 });
    res.json({ applications });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({ application });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ error: 'Failed to fetch application' });
  }
});

router.post(
  '/',
  [body('company').trim().notEmpty().withMessage('Company is required')],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        company,
        role,
        jdLink,
        notes,
        dateApplied,
        status,
        salaryMin,
        salaryMax,
        requiredSkills,
        niceToHaveSkills,
        seniority,
        location,
        resumeSuggestions,
      } = req.body;

      const application = await Application.create({
        user: req.userId,
        company,
        role: role || '',
        jdLink,
        notes,
        dateApplied: dateApplied || new Date(),
        status: status || 'Applied',
        salaryMin,
        salaryMax,
        requiredSkills: requiredSkills || [],
        niceToHaveSkills: niceToHaveSkills || [],
        seniority,
        location,
        resumeSuggestions: resumeSuggestions || [],
      });

      res.status(201).json({ application });
    } catch (error) {
      console.error('Create application error:', error);
      res.status(500).json({ error: 'Failed to create application' });
    }
  }
);

router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const updatableFields: Partial<IApplication> = {
      company: req.body.company,
      role: req.body.role,
      jdLink: req.body.jdLink,
      notes: req.body.notes,
      dateApplied: req.body.dateApplied,
      status: req.body.status,
      salaryMin: req.body.salaryMin,
      salaryMax: req.body.salaryMax,
      requiredSkills: req.body.requiredSkills,
      niceToHaveSkills: req.body.niceToHaveSkills,
      seniority: req.body.seniority,
      location: req.body.location,
      resumeSuggestions: req.body.resumeSuggestions,
    };

    // Remove undefined fields
    Object.keys(updatableFields).forEach(
      (key) =>
        updatableFields[key as keyof Partial<IApplication>] === undefined &&
        delete updatableFields[key as keyof Partial<IApplication>]
    );

    Object.assign(application, updatableFields);
    await application.save();

    res.json({ application });
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ error: 'Failed to update application' });
  }
});

router.patch('/:id/status', async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const validStatuses: ApplicationStatus[] = [
      'Applied',
      'Phone Screen',
      'Interview',
      'Offer',
      'Rejected',
    ];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const application = await Application.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    application.status = status;
    await application.save();

    res.json({ application });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ error: 'Failed to delete application' });
  }
});

router.get('/stats', async (req: AuthRequest, res: Response) => {
  try {
    const applications = await Application.find({ user: req.userId }).sort({
      createdAt: -1,
    });

    const byStatus = {
      Applied: 0,
      'Phone Screen': 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
    } as Record<string, number>;

    applications.forEach((app) => {
      byStatus[app.status] = (byStatus[app.status] || 0) + 1;
    });

    res.json({
      total: applications.length,
      byStatus,
      recentApplications: applications.slice(0, 5),
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export { router as applicationRouter };
