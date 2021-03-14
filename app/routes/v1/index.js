import { Router } from 'express';
import UserRoute from './users';

const router = Router();

router.use('/users', UserRoute);

export default router;
