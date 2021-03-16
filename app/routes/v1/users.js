import { Router } from 'express';
import UserMiddlewares from '../../middlewares/user';
import UserControllers from '../../controllers/users';
import AuthMiddleware from '../../middlewares/auth';

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

router.post(
  '/pin',
  UserMiddlewares.pinUpdateValidator,
  AuthMiddleware.authenticate,
  UserControllers.createTxPin
);

export default router;
