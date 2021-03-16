import { Router } from 'express';
import AuthMiddleware from '../../middlewares/auth';
import WalletMiddleware from '../../middlewares/wallet';
import WalletController from '../../controllers/wallet';
import UserMiddleware from '../../middlewares/user';

const { authenticate } = AuthMiddleware;
const {
  checkIfUserHasWallet,
  checkIfNoWallet,
  checkIfHasEnoughBalance,
  txValidator,
} = WalletMiddleware;
const { getBalance, createWallet, sendEth, getEthTx } = WalletController;
const { checkIfCorrectPin } = UserMiddleware;

const router = Router();
router.use(authenticate);

router.get('/balance', checkIfUserHasWallet, getBalance);
router.post('/', checkIfNoWallet, createWallet);
router.post(
  '/transfer',
  txValidator,
  checkIfCorrectPin,
  checkIfUserHasWallet,
  checkIfHasEnoughBalance,
  sendEth
);
router.get('/tx', checkIfUserHasWallet, getEthTx);

export default router;
