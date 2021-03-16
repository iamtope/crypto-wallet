import constants from '../utils/constants';
import EmailWorker from './workers';

const {
  sendVerificationMail,
} = EmailWorker;

const {
  SEND_VERIFICATION_EMAIL,
} = constants.jobTypes;

export default (queue) => {
  queue.process(SEND_VERIFICATION_EMAIL, sendVerificationMail);
};
