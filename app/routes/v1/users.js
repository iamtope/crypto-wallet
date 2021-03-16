import { Router } from 'express';
import UserMiddlewares from '../../middlewares/user';
import UserControllers from '../../controllers/users';

const router = Router();

router.post(
  '/register',
  UserMiddlewares.signupSchema,
  UserMiddlewares.checkIfUserExist,
  UserControllers.createUser
);

router.post(
  '/login',
  UserMiddlewares.loginSchema,
  UserMiddlewares.checkLoginDetails,
  UserControllers.loginUser
);

router.post('/create/wallet', UserControllers.createWalletAddress);
router.get('/xkx', UserControllers.getBal);

export default router;
