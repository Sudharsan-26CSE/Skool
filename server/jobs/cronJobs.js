import cron from 'node-cron';
import { Staff } from '../models/Staff.js';
import { User } from '../models/User.js';
import nodemailer from 'nodemailer';

// Configure Nodemailer transporter (you should ideally use environment variables for this)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
  port: process.env.EMAIL_PORT || 587,
  auth: {
    user: process.env.EMAIL_USER || 'ethereal.user@ethereal.email',
    pass: process.env.EMAIL_PASS || 'ethereal_password'
  }
});

// Setup node-cron jobs
export const setupCronJobs = () => {
  // Run every day at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily cron job: Check for inactive teachers...');
    try {
      // Find all staff who are teachers
      const inactiveTeachers = await Staff.find({ isActive: false })
        .populate('user')
        .exec();

      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

      for (const teacher of inactiveTeachers) {
        if (teacher.user && teacher.user.role === 'teacher') {
          // If the teacher has an updatedAt older than 2 months and is inactive
          if (teacher.updatedAt < twoMonthsAgo) {
            console.log(`[CRON] Teacher ${teacher.user.name} (${teacher.employeeId}) has been inactive for over 2 months. Sending email...`);
            await sendEmail(teacher.user.email, teacher.user.name);
          }
        }
      }
    } catch (err) {
      console.error('Error in daily cron job:', err);
    }
  });
};

const sendEmail = async (email, name) => {
  if (!email) return;
  try {
    const info = await transporter.sendMail({
      from: '"PreSkool Admin" <admin@preskool.edu>',
      to: email,
      subject: 'Important Notice Regarding Your Employment Status',
      text: `Dear ${name},\n\nWe noticed your account has been inactive for over 2 months. Please contact administration immediately regarding your employment status.\n\nThank you,\nPreSkool Administration`,
      html: `<p>Dear ${name},</p><p>We noticed your account has been inactive for over 2 months. Please contact administration immediately regarding your employment status.</p><p>Thank you,<br>PreSkool Administration</p>`
    });
    console.log(`*** EMAIL SENT to ${email} | Message ID: ${info.messageId} ***`);
  } catch (error) {
    console.error(`Failed to send email to ${email}:`, error);
  }
};
