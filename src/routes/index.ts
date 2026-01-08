import { Router } from 'express';
import authRoutes from './auth.route';
import userRoutes from './user.route';
import roleRoutes from './role.route';
import permissionRoutes from './permission.route';

const router = Router();

// Health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/permissions', permissionRoutes);

export default router;
