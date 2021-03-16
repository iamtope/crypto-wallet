import { Router } from 'express';
import UserRoute from './users';
import walletRoute from './wallet';

const router = Router();

router.use('/users', UserRoute);
router.use('/wallet', walletRoute);

export default router;
