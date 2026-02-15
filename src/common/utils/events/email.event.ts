import { EventEmitter } from 'node:events';
import { template } from '../email/email.template';
import { sendEmail } from '../email/send.email';
import { OTPEnum } from 'src/common/enums/user.enum';

export const emailEvent = new EventEmitter();

emailEvent.on('confirmEmail', async (data) => {
  try {
    data.subject = OTPEnum.verify_email;
    data.html = template(data.otp, data.firstName, data.subject);
    await sendEmail(data);
  } catch (error) {
    console.log('send Email Failed', error);
  }
});
