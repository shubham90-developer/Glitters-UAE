import { GoogleGenerativeAI } from '@google/generative-ai';

// Access your API key as an environment variable
const apiKey = process.env.GOOGLE_AI_API_KEY;


if (!apiKey) {
  throw new Error('Google AI API key is missing in environment variables');
}

// Initialize the Google AI
const genAI = new GoogleGenerativeAI(apiKey);

export class AIService {
  private model;

  constructor() {
    // Initialize the model
    this.model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }

  /**
   * Generate a description based on a title and context.
   * @param name - The name of the item (e.g., restaurant or product name).
   * @param context - The context (e.g., "restaurant", "food item", "restaurant offer").
   * @returns Generated description text.
   */
  async generateDescription(name: string, context: string): Promise<string> {
    try {
      let prompt = '';
      
      if (context === 'restaurant offer') {
        prompt = `Generate a compelling and detailed description for a restaurant offer or promotion titled "${name}". 
        The description should be 2-3 sentences long and include details about:
        - What the offer includes (discount percentage, free items, etc.)
        - Validity period or timing restrictions
        - Any terms and conditions
        - Appeal to customers to take action
        Make it engaging and marketing-focused.`;
      } else {
        prompt = `Generate a short, engaging, and sales-oriented description for a ${context} named "${name}". 
        The description should be 2-3 sentences long, highlighting its key features and appeal to customers.
        Keep it concise and appealing.`;
      }

      // Generate content
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error(`Error generating ${context} description:`, error);
      throw new Error(`Failed to generate ${context} description`);
    }
  }

  /**
   * Improves an existing text description.
   * @param text - The text to improve.
   * @param context - The context for the improvement (e.g., "description for restaurant 'My Restaurant'", "restaurant offer").
   * @returns The improved text.
   */
  async improveDescription(text: string, context: string): Promise<string> {
    try {
      let prompt = '';
      
      if (context === 'restaurant offer') {
        prompt = `Rewrite and improve the following restaurant offer description to make it more compelling and marketing-focused.
        Make it more engaging, add urgency if appropriate, and ensure it clearly communicates the value proposition.
        
        Original Text: "${text}"

        Keep the core offer details but enhance the wording, style, and appeal. Return only the improved text.`;
      } else {
        prompt = `Rewrite and improve the following text to make it more engaging and professional.
        The context is: ${context}.
        
        Original Text: "${text}"

        Keep the core message but enhance the wording and style. Return only the improved text.`;
      }

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error improving description:', error);
      throw new Error('Failed to improve description');
    }
  }

  /**
   * Generates content for legal or informational documents.
   * @param documentType - The type of document to generate (e.g., 'privacy-policy').
   * @param platformName - The name of the platform (e.g., 'AIR Manu').
   * @returns Generated text for the document.
   */
  async generateDocument(documentType: 'privacy-policy' | 'terms-and-conditions' | 'help-and-support', platformName: string): Promise<string> {
    let prompt = '';
    switch(documentType) {
      case 'privacy-policy':
        prompt = `Generate a comprehensive privacy policy for a multi-vendor restaurant platform named "${platformName}". The policy should be written in clear, simple language and be suitable for a general audience. It must include sections covering:
        1.  **Introduction**: Briefly explain the purpose of the policy.
        2.  **Information We Collect**: Detail the types of personal data collected from both customers (e.g., name, contact info, order history, location data) and restaurant vendors (e.g., business details, contact info, financial data).
        3.  **How We Use Your Information**: Explain the purposes for using the collected data (e.g., processing orders, improving service, marketing, vendor payouts).
        4.  **How We Share Your Information**: Describe how and with whom data is shared (e.g., with restaurants for order fulfillment, with payment processors, with analytics services).
        5.  **Data Security**: Outline the measures taken to protect user data.
        6.  **Your Rights and Choices**: Explain user rights regarding their data (e.g., access, correction, deletion).
        7.  **Cookies and Tracking Technologies**: Briefly describe the use of cookies.
        8.  **Changes to This Policy**: State that the policy may be updated.
        9.  **Contact Us**: Provide a way for users to ask questions.
        Return only the generated HTML content for the document, ready to be displayed.`;
        break;
      case 'terms-and-conditions':
        prompt = `Generate comprehensive terms and conditions for a multi-vendor restaurant platform named "${platformName}". The terms should be clear and fair to both users and vendors. It must include sections covering:
        1.  **Acceptance of Terms**: User agreement to the terms.
        2.  **Service Description**: Description of the platform's services.
        3.  **User Accounts**: Responsibilities for account creation and security.
        4.  **Vendor Responsibilities**: Obligations for vendors, including menu accuracy and order fulfillment.
        5.  **Ordering and Payment**: The process of placing and paying for orders.
        6.  **Intellectual Property**: Ownership of content on the platform.
        7.  **Limitation of Liability**: Disclaimer of liability.
        8.  **Termination**: Conditions for account termination.
        9.  **Governing Law**: The jurisdiction governing the terms.
        10. **Contact Information**: How to contact the platform for queries.
        Return only the generated HTML content for the document, ready to be displayed.`;
        break;
      case 'help-and-support':
        prompt = `Generate a friendly and helpful FAQ and support page for a multi-vendor restaurant platform named "${platformName}". The tone should be supportive and easy to understand. Structure it with clear headings and include common questions for both customers and vendors.
        
        **For Customers, include questions like:**
        - How do I place an order?
        - How can I pay for my order?
        - Can I cancel my order?
        - How do I report a problem with my order?
        - How do I manage my account details?
        
        **For Vendors, include questions like:**
        - How do I sign up my restaurant?
        - How do I manage my menu and prices?
        - How do I view and manage incoming orders?
        - When and how do I get paid?
        - How can I contact vendor support?
        
        **Also include a general "Contact Us" section.**
        
        Return only the generated HTML content for the document, ready to be displayed.`;
        break;
      default:
        throw new Error('Invalid document type specified.');
    }

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error(`Error generating ${documentType}:`, error);
      throw new Error(`Failed to generate ${documentType}`);
    }
  }

  /**
   * Generic text generation method for reusability
   * @param prompt - The prompt to generate content for
   * @returns Generated text
   */
  async generateText(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error generating text with AI:', error);
      throw new Error('Failed to generate text');
    }
  }

  /**
   * Generate AI chat response for hotel menu assistance
   * @param hotel - Hotel object with menu data
   * @param userMessage - User's message/question
   * @param conversationHistory - Previous conversation messages
   * @returns AI response about the hotel menu
   */
  async generateHotelMenuChat(hotel: any, userMessage: string, conversationHistory: any[] = []): Promise<string> {
    try {
      // Prepare hotel menu data for AI context
      const menuContext = {
        restaurantName: hotel.name,
        location: hotel.location,
        cuisine: hotel.cuisine,
        priceRange: hotel.price,
        rating: hotel.rating,
        categories: hotel.menuCategories.map((category: any) => ({
          name: category.name,
          items: category.items.map((item: any) => ({
            title: item.title,
            description: item.description,
            price: item.price,
            isVeg: item.itemType?.includes('Veg'),
            isNonVeg: item.itemType?.includes('Non-Veg'),
            isEgg: item.itemType?.includes('Contains Egg'),
            attributes: item.attributes || [],
            options: item.options || [],
            offer: item.offer || ''
          }))
        })),
        offers: {
          preBookOffers: hotel.preBookOffers || [],
          walkInOffers: hotel.walkInOffers || [],
          bankBenefits: hotel.bankBenefits || []
        }
      };

      // Build conversation context
      let conversationContext = '';
      if (conversationHistory.length > 0) {
        conversationContext = '\n\nPrevious conversation:\n' + 
          conversationHistory.slice(-4).map((msg: any) => 
            `${msg.sender === 'user' ? 'Customer' : 'AI'}: ${msg.message}`
          ).join('\n');
      }

      const prompt = `You are a friendly AI menu assistant for "${hotel.name}", a ${hotel.cuisine} restaurant located in ${hotel.location}. 
      Your role is to help customers discover and choose from our menu items, answer questions about ingredients, suggest dishes based on preferences, and provide information about offers.

      Restaurant Details:
      - Name: ${hotel.name}
      - Cuisine: ${hotel.cuisine}
      - Price Range: ${hotel.price}
      - Rating: ${hotel.rating}/5
      - Location: ${hotel.location}

      Available Menu:
      ${JSON.stringify(menuContext.categories, null, 2)}

      Current Offers:
      ${JSON.stringify(menuContext.offers, null, 2)}

      ${conversationContext}

      Customer's Question: "${userMessage}"

      Please respond as a helpful menu assistant. Keep your response conversational, friendly, and focused on our menu. When recommending dishes, ALWAYS mention the exact dish names as they appear in our menu so they can be displayed as cards.

      Guidelines:
      - Always stay focused on our restaurant's menu and offerings
      - Be enthusiastic about our food
      - When suggesting dishes, use their EXACT names from the menu (e.g., "Cheese Burger", "New York Pizza")
      - Mention prices when discussing specific items
      - Highlight vegetarian/non-vegetarian options when relevant
      - For recommendations, suggest 2-3 specific items with brief explanations
      - If asked about offers, mention relevant current promotions
      - Keep responses concise but informative (2-4 sentences max)
      - If you don't have specific information, politely say so and offer alternatives

      IMPORTANT: When mentioning food items, use their exact titles from our menu data so they can be displayed as interactive cards to the user.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error generating hotel menu chat response:', error);
      return "I'm sorry, I'm having trouble accessing our menu information right now. Please try asking again, or feel free to browse our menu directly!";
    }
  }

  /**
   * Generate AI food suggestions with explanations
   * @param menuItems - Array of menu items from all hotels
   * @param limit - Number of suggestions to return
   * @returns Array of AI-curated food suggestions with explanations
   */
  async generateFoodSuggestions(menuItems: any[], limit: number = 10): Promise<any[]> {
    try {
      // Create a comprehensive prompt for AI analysis
      const itemsForAnalysis = menuItems.slice(0, 15).map(item => ({
        title: item.title,
        description: item.description,
        price: item.price,
        isVeg: item.isVeg,
        isNonVeg: item.isNonVeg,
        isEgg: item.isEgg,
        spicy: item.spicy,
        isQuick: item.isQuick,
        isHighlyReordered: item.isHighlyReordered,
        hotelName: item.hotelName,
        hotelRating: item.hotelRating,
        categoryName: item.categoryName
      }));

      const prompt = `As a food expert and nutritionist, analyze these menu items and select the top ${limit} most recommended dishes. 
      For each recommended dish, provide a brief explanation (2-3 sentences) about why it's special, healthy, or popular.
      
      Menu Items:
      ${JSON.stringify(itemsForAnalysis, null, 2)}
      
      Please respond with a JSON array containing exactly ${limit} items, each with this structure:
      {
        "title": "dish name",
        "aiExplanation": "2-3 sentence explanation of why this dish is recommended",
        "healthScore": number from 1-10,
        "popularityReason": "brief reason why people love this dish"
      }
      
      Focus on variety, nutritional value, taste, and popularity. Ensure the response is valid JSON only.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const aiText = response.text().trim();

      // Parse AI response
      let aiRecommendations: any[] = [];
      try {
        // Extract JSON from the response
        const jsonMatch = aiText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          aiRecommendations = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No valid JSON found in AI response');
        }
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        // Fallback: return top items without AI analysis
        aiRecommendations = menuItems.slice(0, limit).map(item => ({
          title: item.title,
          aiExplanation: "This dish is popular among our customers and offers great taste and quality.",
          healthScore: item.isVeg ? 8 : 6,
          popularityReason: item.isHighlyReordered ? "Highly reordered by customers" : "Chef's special recommendation"
        }));
      }

      // Merge AI recommendations with original menu item data
      const finalSuggestions = aiRecommendations.map(aiItem => {
        const originalItem = menuItems.find(item => 
          item.title.toLowerCase().includes(aiItem.title.toLowerCase()) ||
          aiItem.title.toLowerCase().includes(item.title.toLowerCase())
        );

        if (originalItem) {
          return {
            ...originalItem,
            aiExplanation: aiItem.aiExplanation,
            healthScore: aiItem.healthScore,
            popularityReason: aiItem.popularityReason,
            isAIRecommended: true
          };
        }

        return null;
      }).filter(Boolean);

      // If we don't have enough matches, fill with top-rated items
      if (finalSuggestions.length < limit) {
        const remainingSlots = limit - finalSuggestions.length;
        const additionalItems = menuItems
          .filter(item => !finalSuggestions.some(suggested => suggested.id === item.id))
          .slice(0, remainingSlots)
          .map(item => ({
            ...item,
            aiExplanation: "This dish stands out for its exceptional taste and quality ingredients.",
            healthScore: item.isVeg ? 7 : 5,
            popularityReason: "Recommended by our culinary experts",
            isAIRecommended: true
          }));

        finalSuggestions.push(...additionalItems);
      }

      return finalSuggestions.slice(0, limit);
    } catch (error) {
      console.error('Error generating food suggestions:', error);
      
      // Fallback: return top menu items with basic explanations
      return menuItems.slice(0, limit).map(item => ({
        ...item,
        aiExplanation: "This delicious dish is crafted with care and loved by our customers for its authentic flavors.",
        healthScore: item.isVeg ? 7 : 5,
        popularityReason: item.isHighlyReordered ? "Customer favorite" : "Chef's recommendation",
        isAIRecommended: true
      }));
    }
  }
}

// Create a singleton instance
export const aiService = new AIService();
