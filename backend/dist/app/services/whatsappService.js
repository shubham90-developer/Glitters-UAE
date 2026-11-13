"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.whatsappTemplates = exports.sendWhatsAppMessage = void 0;
// WhatsApp Service for sending messages via WhatsApp API
const WHATSAPP_API_KEY = '274d09e223464ff89c9ba70a7b68434e';
const WHATSAPP_API_URL = 'http://wapi.nationalsms.in/wapp/v2/api/send';
const sendWhatsAppMessage = (options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phone, message } = options;
        // Construct API URL with parameters
        const url = `${WHATSAPP_API_URL}?apikey=${WHATSAPP_API_KEY}&mobile=${phone}&msg=${encodeURIComponent(message)}`;
        const response = yield fetch(url);
        const result = yield response.text();
        console.log(`📱 WhatsApp message sent to ${phone}`);
        console.log(`WhatsApp API Response: ${result}`);
        return true;
    }
    catch (error) {
        console.error('WhatsApp message sending failed:', error);
        return false;
    }
});
exports.sendWhatsAppMessage = sendWhatsAppMessage;
// WhatsApp Message Templates
exports.whatsappTemplates = {
    vendorApplicationReceived: (vendorName) => {
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
    vendorApproved: (vendorName, email, password, services, panelUrl) => {
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
    vendorRejected: (vendorName, reason) => {
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
