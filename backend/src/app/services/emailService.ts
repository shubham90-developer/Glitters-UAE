import nodemailer from 'nodemailer';

// ─── Resend API (HTTPS-based, works on DigitalOcean where SMTP ports are blocked) ───
const sendViaResend = async (options: EmailOptions): Promise<boolean> => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'MovieMart <onboarding@resend.dev>';

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text || undefined,
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error('Resend API error:', res.status, errorBody);
      return false;
    }

    const data = await res.json();
    console.log(`Email sent via Resend to ${options.to} (id: ${data.id})`);
    return true;
  } catch (error) {
    console.error('Resend email failed:', error);
    return false;
  }
};

// ─── Nodemailer SMTP (works locally / when SMTP ports are open) ───
const createTransporter = () => {
  const isGmail = process.env.SMTP_HOST?.includes('gmail') || !process.env.SMTP_HOST;

  const config = isGmail ? {
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  } : {
    host: process.env.SMTP_HOST || 'smtpout.secureserver.net',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  };

  console.log('SMTP Configuration:', {
    type: isGmail ? 'Gmail' : 'Custom SMTP',
    host: (config as any).host || 'gmail',
    port: (config as any).port || 'default',
    user: config.auth.user,
    passwordSet: !!config.auth.pass,
  });

  return nodemailer.createTransport(config as any);
};

const sendViaSMTP = async (options: EmailOptions): Promise<boolean> => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"MovieMart" <info@moviemart.org>`,
      replyTo: process.env.SMTP_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || '',
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent via SMTP to ${options.to}`);
    return true;
  } catch (error) {
    console.error('SMTP email failed:', error);
    return false;
  }
};

// ─── Main sendEmail: tries Resend first (HTTPS), falls back to SMTP ───
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  // If RESEND_API_KEY is set, use Resend (works on VPS where SMTP is blocked)
  if (process.env.RESEND_API_KEY) {
    const resendResult = await sendViaResend(options);
    if (resendResult) return true;
    console.warn('Resend failed, falling back to SMTP...');
  }

  // Fallback to SMTP (works locally)
  return sendViaSMTP(options);
};

// Generate random 8-digit password
export const generatePassword = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Email Templates
export const emailTemplates = {
  vendorApplicationReceived: (vendorName: string) => ({
    subject: 'Vendor Application Received - MovieMart',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .highlight { color: #667eea; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎬 MovieMart</h1>
            <p>Application Received</p>
          </div>
          <div class="content">
            <h2>Hello ${vendorName},</h2>
            <p>Thank you for submitting your vendor application to <span class="highlight">MovieMart</span>!</p>
            <p>We have received your application and our team is currently reviewing it. This process typically takes 1-3 business days.</p>
            <p>You will receive an email notification once your application has been reviewed.</p>
            <p><strong>What's Next?</strong></p>
            <ul>
              <li>Our team will verify your documents</li>
              <li>We'll review your business information</li>
              <li>You'll receive approval or feedback via email</li>
            </ul>
            <p>If you have any questions, feel free to contact our support team.</p>
            <p>Best regards,<br><strong>The MovieMart Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} MovieMart. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  vendorApproved: (vendorName: string, email: string, password: string, services: string[], panelUrl: string) => ({
    subject: '🎉 Congratulations! Your Vendor Application is Approved - MovieMart',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .credentials { background: #fff; border: 2px solid #11998e; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .credentials h3 { color: #11998e; margin-top: 0; }
          .cred-item { margin: 10px 0; padding: 10px; background: #f0f9f7; border-radius: 5px; }
          .cred-label { color: #666; font-size: 12px; }
          .cred-value { font-size: 16px; font-weight: bold; color: #333; word-break: break-all; }
          .btn { display: inline-block; background: #11998e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .services { background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎬 MovieMart</h1>
            <p>Application Approved!</p>
          </div>
          <div class="content">
            <h2>Congratulations ${vendorName}! 🎉</h2>
            <p>Great news! Your vendor application has been <strong style="color: #11998e;">APPROVED</strong>.</p>
            
            <div class="services">
              <strong>Your Activated Services:</strong>
              <ul>
                ${services.map(s => `<li>${s}</li>`).join('')}
              </ul>
            </div>

            <div class="credentials">
              <h3>🔐 Your Login Credentials</h3>
              <div class="cred-item">
                <div class="cred-label">Email</div>
                <div class="cred-value">${email}</div>
              </div>
              <div class="cred-item">
                <div class="cred-label">Password</div>
                <div class="cred-value">${password}</div>
              </div>
              <div class="cred-item">
                <div class="cred-label">Vendor Panel URL</div>
                <div class="cred-value">${panelUrl}</div>
              </div>
            </div>

            <p><strong>⚠️ Important:</strong> Please change your password after your first login for security purposes.</p>
            
            <center>
              <a href="${panelUrl}" class="btn">Login to Vendor Panel</a>
            </center>

            <p style="margin-top: 30px;">If you have any questions, our support team is here to help!</p>
            <p>Best regards,<br><strong>The MovieMart Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} MovieMart. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  vendorRejected: (vendorName: string, reason: string) => ({
    subject: 'Vendor Application Update - MovieMart',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .reason-box { background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎬 MovieMart</h1>
            <p>Application Update</p>
          </div>
          <div class="content">
            <h2>Hello ${vendorName},</h2>
            <p>Thank you for your interest in becoming a vendor on MovieMart.</p>
            <p>After careful review, we regret to inform you that your application could not be approved at this time.</p>
            
            <div class="reason-box">
              <strong>Reason:</strong>
              <p>${reason}</p>
            </div>

            <p>You are welcome to submit a new application after addressing the above concerns.</p>
            <p>If you believe this decision was made in error or have questions, please contact our support team.</p>
            <p>Best regards,<br><strong>The MovieMart Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} MovieMart. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
};