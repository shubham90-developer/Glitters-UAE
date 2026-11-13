// WhatsApp Service for sending messages via WhatsApp API
const WHATSAPP_API_KEY = '274d09e223464ff89c9ba70a7b68434e';
const WHATSAPP_API_URL = 'http://wapi.nationalsms.in/wapp/v2/api/send';

interface WhatsAppMessageOptions {
  phone: string;
  message: string;
}

export const sendWhatsAppMessage = async (options: WhatsAppMessageOptions): Promise<boolean> => {
  try {
    const { phone, message } = options;
    
    // Construct API URL with parameters
    const url = `${WHATSAPP_API_URL}?apikey=${WHATSAPP_API_KEY}&mobile=${phone}&msg=${encodeURIComponent(message)}`;
    
    const response = await fetch(url);
    const result = await response.text();
    
    console.log(`📱 WhatsApp message sent to ${phone}`);
    console.log(`WhatsApp API Response: ${result}`);
    
    return true;
  } catch (error) {
    console.error('WhatsApp message sending failed:', error);
    return false;
  }
};

// WhatsApp Message Templates
export const whatsappTemplates = {
  vendorApplicationReceived: (vendorName: string) => {
    return `🎬 *MovieMart - Application Received*

Hello ${vendorName},

Thank you for submitting your vendor application to MovieMart!

✅ We have received your application
⏳ Our team is currently reviewing it
📧 You'll receive updates via email and WhatsApp

*What's Next?*
• Document verification (1-3 business days)
• Business information review
• Approval notification

For questions, contact our support team.

Best regards,
*The MovieMart Team*`;
  },

  vendorApproved: (vendorName: string, email: string, password: string, services: string[], panelUrl: string) => {
    const servicesList = services.map(s => `• ${s}`).join('\n');
    
    return `🎉 *Congratulations ${vendorName}!*

Your MovieMart vendor application is *APPROVED*!

*Your Activated Services:*
${servicesList}

*🔐 Login Credentials:*
📧 Email: ${email}
🔑 Password: ${password}
🌐 Panel: ${panelUrl}

⚠️ *Important:* Change your password after first login.

Login now: ${panelUrl}

Welcome to MovieMart!
*The MovieMart Team*`;
  },

  vendorRejected: (vendorName: string, reason: string) => {
    return `🎬 *MovieMart - Application Update*

Hello ${vendorName},

Thank you for your interest in becoming a MovieMart vendor.

After review, we regret that your application could not be approved at this time.

*Reason:*
${reason}

You're welcome to submit a new application after addressing the concerns.

For questions, contact our support team.

Best regards,
*The MovieMart Team*`;
  },
};
