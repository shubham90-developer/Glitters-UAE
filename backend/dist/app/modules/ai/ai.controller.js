"use strict";
// import { Request, Response, NextFunction } from 'express';
// import { aiService } from '../../services/aiService';
// import { appError } from '../../errors/appError';
// import { Hotel } from '../hotel/hotel.model';
// export const generateDescriptionController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { name, context } = req.body;
//     if (!name || typeof name !== 'string') {
//        next(new appError('Name is required', 400));
//        return;
//     }
//     if (!context || typeof context !== 'string') {
//       next(new appError('Context is required', 400));
//       return;
//    }
//     const description = await aiService.generateDescription(name, context);
//     res.json({
//       success: true,
//       statusCode: 200,
//       message: 'Description generated successfully',
//       data: { description },
//     });
//     return;
//   } catch (error) {
//     next(error);
//   }
// };
// export const improveDescriptionController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { text, context } = req.body;
//     if (!text || typeof text !== 'string') {
//       next(new appError('Text to improve is required', 400));
//       return;
//     }
//     if (!context || typeof context !== 'string') {
//         next(new appError('Context is required', 400));
//         return;
//     }
//     const description = await aiService.improveDescription(text, context);
//     res.json({
//       success: true,
//       statusCode: 200,
//       message: 'Description improved successfully',
//       data: { description },
//     });
//     return;
//   } catch (error) {
//     next(error);
//   }
// };
// export const generateDocumentController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { documentType, platformName = 'AIR Manu' } = req.body;
//     if (!documentType || !['privacy-policy', 'terms-and-conditions', 'help-and-support'].includes(documentType)) {
//       return next(new appError('A valid documentType is required.', 400));
//     }
//     const content = await aiService.generateDocument(documentType, platformName);
//     res.json({
//       success: true,
//       statusCode: 200,
//       message: 'Document content generated successfully.',
//       data: { content },
//     });
//   } catch (error) {
//     next(error);
//   }
// };
// export const generateGenericText = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { prompt } = req.body;
//     if (!prompt || typeof prompt !== 'string') {
//        next(new appError('Prompt is required', 400));
//        return;
//     }
//     const text = await aiService.generateText(prompt);
//     res.json({
//       success: true,
//       statusCode: 200,
//       message: 'Text generated successfully',
//       data: { text },
//     });
//     return;
//   } catch (error) {
//     next(error);
//   }
// };
// export const getAIFoodSuggestions = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { limit = 10, cuisine, dietary } = req.query;
//     // Get all hotels with their menu items
//     const hotels = await Hotel.find({ 
//       isDeleted: false,
//       'menuCategories.0': { $exists: true } // Only hotels with menu items
//     }).select('name location menuCategories rating');
//     if (!hotels || hotels.length === 0) {
//       res.json({
//         success: true,
//         statusCode: 200,
//         message: 'No menu items found',
//         data: [],
//       });
//       return;
//     }
//     // Collect all menu items from all hotels
//     const allMenuItems: any[] = [];
//     hotels.forEach(hotel => {
//       hotel.menuCategories.forEach(category => {
//         category.items.forEach(item => {
//           allMenuItems.push({
//             ...item.toObject(),
//             hotelName: hotel.name,
//             hotelLocation: hotel.location,
//             hotelRating: hotel.rating,
//             categoryName: category.name,
//             hotelId: hotel._id
//           });
//         });
//       });
//     });
//     // Filter based on query parameters
//     let filteredItems = allMenuItems;
//     if (cuisine) {
//       filteredItems = filteredItems.filter(item => 
//         item.categoryName.toLowerCase().includes((cuisine as string).toLowerCase())
//       );
//     }
//     if (dietary) {
//       const dietaryFilter = (dietary as string).toLowerCase();
//       filteredItems = filteredItems.filter(item => {
//         if (dietaryFilter === 'veg') return item.isVeg;
//         if (dietaryFilter === 'nonveg') return item.isNonVeg;
//         if (dietaryFilter === 'egg') return item.isEgg;
//         return true;
//       });
//     }
//     // Sort by rating and popularity
//     filteredItems.sort((a, b) => {
//       // Prioritize highly reordered items and higher hotel ratings
//       const scoreA = (a.isHighlyReordered ? 2 : 0) + (a.hotelRating || 0);
//       const scoreB = (b.isHighlyReordered ? 2 : 0) + (b.hotelRating || 0);
//       return scoreB - scoreA;
//     });
//     // Get top items for AI analysis
//     const topItems = filteredItems.slice(0, Math.min(20, filteredItems.length));
//     // Generate AI suggestions
//     const aiSuggestions = await aiService.generateFoodSuggestions(topItems, Number(limit));
//     res.json({
//       success: true,
//       statusCode: 200,
//       message: 'AI food suggestions generated successfully',
//       data: aiSuggestions,
//     });
//     return;
//   } catch (error) {
//     next(error);
//   }
// };
// export const getHotelMenuChat = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { hotelId, message, conversationHistory = [] } = req.body;
//     if (!hotelId || !message) {
//       next(new appError('Hotel ID and message are required', 400));
//       return;
//     }
//     // Get the specific hotel with its menu
//     const hotel = await Hotel.findOne({ 
//       _id: hotelId, 
//       isDeleted: false 
//     }).select('name location menuCategories cuisine price rating offers preBookOffers walkInOffers bankBenefits aboutInfo');
//     if (!hotel) {
//       next(new appError('Hotel not found', 404));
//       return;
//     }
//     // Generate AI response for hotel menu chat
//     const aiResponse = await aiService.generateHotelMenuChat(hotel, message, conversationHistory);
//     res.json({
//       success: true,
//       statusCode: 200,
//       message: 'AI menu chat response generated successfully',
//       data: {
//         response: aiResponse,
//         hotelName: hotel.name,
//         timestamp: new Date().toISOString()
//       },
//     });
//     return;
//   } catch (error) {
//     next(error);
//   }
// };
