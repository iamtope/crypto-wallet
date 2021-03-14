import { Router } from 'express';
import UserMiddlewares from '../../middlewares/user/index';
import UserControllers from '../../controllers/users/index';

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

export default router;
