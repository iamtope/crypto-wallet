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
  btcValidator,
  checkIfNoBtcWallet,
  checkIfUserHasBtcWallet,
  checkIFUserHasEnoughBtc
} = WalletMiddleware;
const {
  getBalance, createWallet, getBtcBalance,
  sendEth, getEthTx, createBtcWallet, sendBtc,
  getBtcTx
} = WalletController;
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
router.post('/btc', checkIfNoBtcWallet, createBtcWallet);
router.get('/btc/balance', checkIfUserHasBtcWallet, getBtcBalance);
router.post(
  '/btc/transfer',
  btcValidator,
  checkIfCorrectPin,
  checkIfUserHasBtcWallet,
  checkIFUserHasEnoughBtc,
  sendBtc
);
router.get('/btc/tx', checkIfUserHasBtcWallet, getBtcTx);

export default router;
