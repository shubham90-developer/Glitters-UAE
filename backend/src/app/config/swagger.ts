import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'swagger doc',
      version: '1.0.0',
    contact: {
        name: 'ATIS Team',
        email: 'support@atis.com',
      },
      license: {
        name: 'ISC',
      },
    },
    servers: [
      {
        url: 'http://localhost:8090',
        description: 'Development server',
      },
      {
        url: 'http://31.97.207.6:8090',
        description: 'Production server',
      }
   
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID',
            },
            name: {
              type: 'string',
              description: 'User full name',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            phone: {
              type: 'string',
              description: 'User phone number',
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'pending'],
              description: 'User account status',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
     
        // Category: {
        //   type: 'object',
        //   required: ['title', 'image'],
        //   properties: {
        //     _id: {
        //       type: 'string',
        //       description: 'Category ID',
        //       example: '66d88b4ea31a5e0f9c123456'
        //     },
        //     title: {
        //       type: 'string',
        //       description: 'Category title',
        //       example: 'Action'
        //     },
        //     image: {
        //       type: 'string',
        //       description: 'Category image URL',
        //       example: 'https://res.cloudinary.com/demo/image/upload/v1724300000/moviemart/categories/action.jpg'
        //     },
        //     status: {
        //       type: 'string',
        //       enum: ['active', 'inactive'],
        //       description: 'Category status (optional; not enforced in backend model)',
        //       example: 'active'
        //     },
        //   },
        // },

        Project: {
          type: 'object',
          required: ['name'],
          properties: {
            _id: { type: 'string', example: '66d88b4ea31a5e0f9c123456' },
            name: { type: 'string', example: 'Prapti Cycle Website' },
            description: { type: 'string', example: 'Corporate website with CMS' },
            quotationNumber: { type: 'string', example: 'QT-001' },
            lpoNumber: { type: 'string', example: 'LPO-001' },
            status: {
              type: 'string',
              enum: ['new', 'in_progress', 'on_hold', 'completed', 'cancelled'],
              example: 'new',
            },
            priority: {
              type: 'string',
              enum: ['critical', 'high', 'medium', 'low'],
              example: 'high',
            },
            projectType: { type: 'string', example: 'Website' },
            assignedMembers: {
              type: 'array',
              items: { type: 'string' },
              example: ['Vikas Saini', 'Lokesh Yadav'],
            },
            ownerName: { type: 'string', example: 'John Doe' },
            ownerMobile: { type: 'string', example: '+91 9090909090' },
            ownerEmail: { type: 'string', format: 'email', example: 'john@example.com' },
            projectManager: { type: 'string', example: 'Suraj Jamdade' },
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
            duration: { type: 'string', example: '30 days' },
            progress: {
              type: 'integer',
              minimum: 0,
              maximum: 100,
              description: 'Project completion percentage',
              example: 50,
            },
            file: {
              type: 'string',
              description: 'Cloudinary URL of the uploaded attachment',
              example: 'https://res.cloudinary.com/demo/raw/upload/v1/projects/file.pdf',
            },
            refUrl: { type: 'string', example: 'https://example.com' },
            isDeleted: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
  
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './src/app/modules/*/*.routes.ts',
    './src/app/modules/*/*.controller.ts',
    './src/app/routes/index.ts',
  ],
};

const specs = swaggerJSDoc(options);

export const setupSwagger = (app: Application): void => {
  // ElysiaJS-inspired modern Swagger UI with enhanced styling
  const customCss = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
    
    /* Reset and base styles */
    .swagger-ui * {
      box-sizing: border-box;
    }
    
    /* Hide default topbar */
    .swagger-ui .topbar { display: none; }
    
    /* Main container - clean white background like ElysiaJS */
    .swagger-ui {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #ffffff;
      color: #1a1a1a;
      line-height: 1.6;
    }
    
    /* Info section - minimal and clean */
    .swagger-ui .info {
      background: transparent;
      padding: 3rem 0 2rem 0;
      margin: 0;
      border: none;
      box-shadow: none;
    }
    
    .swagger-ui .info .title {
      color: #1a1a1a;
      font-size: 2.25rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      letter-spacing: -0.025em;
    }
    
    .swagger-ui .info .description {
      color: #6b7280;
      font-size: 1rem;
      font-weight: 400;
      margin-bottom: 2rem;
    }
    
    /* Wrapper for better spacing */
    .swagger-ui .wrapper {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }
    
    /* Operation blocks - clean and minimal */
    .swagger-ui .opblock {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      margin: 0 0 1rem 0;
      box-shadow: none;
      overflow: hidden;
    }
    
    .swagger-ui .opblock:hover {
      border-color: #d1d5db;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    /* Method colors - subtle and modern */
    .swagger-ui .opblock.opblock-get {
      border-left: 3px solid #10b981;
    }
    
    .swagger-ui .opblock.opblock-post {
      border-left: 3px solid #3b82f6;
    }
    
    .swagger-ui .opblock.opblock-put {
      border-left: 3px solid #f59e0b;
    }
    
    .swagger-ui .opblock.opblock-patch {
      border-left: 3px solid #8b5cf6;
    }
    
    .swagger-ui .opblock.opblock-delete {
      border-left: 3px solid #ef4444;
    }
    
    /* Operation summary */
    .swagger-ui .opblock-summary {
      padding: 1rem 1.5rem;
      background: transparent;
      border: none;
      cursor: pointer;
    }
    
    .swagger-ui .opblock-summary:hover {
      background: #f9fafb;
    }
    
    /* Method badges */
    .swagger-ui .opblock-summary-method {
      border-radius: 4px;
      padding: 0.25rem 0.75rem;
      font-weight: 600;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      min-width: 60px;
      text-align: center;
    }
    
    .swagger-ui .opblock.opblock-get .opblock-summary-method {
      background: #10b981;
      color: white;
    }
    
    .swagger-ui .opblock.opblock-post .opblock-summary-method {
      background: #3b82f6;
      color: white;
    }
    
    .swagger-ui .opblock.opblock-put .opblock-summary-method {
      background: #f59e0b;
      color: white;
    }
    
    .swagger-ui .opblock.opblock-patch .opblock-summary-method {
      background: #8b5cf6;
      color: white;
    }
    
    .swagger-ui .opblock.opblock-delete .opblock-summary-method {
      background: #ef4444;
      color: white;
    }
    
    /* Path styling */
    .swagger-ui .opblock-summary-path {
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-weight: 500;
      color: #374151;
      font-size: 0.875rem;
      margin-left: 1rem;
    }
    
    .swagger-ui .opblock-summary-description {
      color: #6b7280;
      font-size: 0.875rem;
      margin-left: auto;
    }
    
    /* Expanded content */
    .swagger-ui .opblock-description-wrapper {
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
      padding: 1.5rem;
    }
    
    /* Tags - clean section headers */
    .swagger-ui .opblock-tag {
      background: transparent;
      border: none;
      margin: 2rem 0 1rem 0;
      box-shadow: none;
    }
    
    .swagger-ui .opblock-tag-section h3 {
      background: transparent;
      color: #1a1a1a;
      padding: 0;
      margin: 0 0 1rem 0;
      font-size: 1.5rem;
      font-weight: 600;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 0.5rem;
    }
    
    /* Buttons - clean and modern */
    .swagger-ui .btn {
      border-radius: 6px;
      font-weight: 500;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      border: 1px solid transparent;
      transition: all 0.15s ease;
    }
    
    .swagger-ui .btn.authorize {
      background: #3b82f6;
      color: white;
      border-color: #3b82f6;
    }
    
    .swagger-ui .btn.authorize:hover {
      background: #2563eb;
      border-color: #2563eb;
    }
    
    .swagger-ui .btn.execute {
      background: #10b981;
      color: white;
      border-color: #10b981;
    }
    
    .swagger-ui .btn.execute:hover {
      background: #059669;
      border-color: #059669;
    }
    
    .swagger-ui .btn.try-out__btn {
      background: transparent;
      color: #3b82f6;
      border-color: #3b82f6;
    }
    
    .swagger-ui .btn.try-out__btn:hover {
      background: #3b82f6;
      color: white;
    }
    
    /* Parameters table */
    .swagger-ui table {
      border-collapse: collapse;
      width: 100%;
    }
    
    .swagger-ui table thead tr td,
    .swagger-ui table thead tr th {
      background: #f9fafb;
      color: #374151;
      font-weight: 600;
      font-size: 0.875rem;
      padding: 0.75rem;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .swagger-ui table tbody tr td {
      padding: 0.75rem;
      border-bottom: 1px solid #f3f4f6;
      font-size: 0.875rem;
    }
    
    /* Response section */
    .swagger-ui .responses-wrapper {
      background: transparent;
      border: none;
      padding: 0;
      margin-top: 1.5rem;
    }
    
    .swagger-ui .response-col_status {
      font-family: 'JetBrains Mono', monospace;
      font-weight: 500;
    }
    
    /* Code blocks */
    .swagger-ui .highlight-code {
      background: #1f2937;
      color: #f9fafb;
      border-radius: 6px;
      padding: 1rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.875rem;
    }
    
    /* Input fields */
    .swagger-ui input[type=text],
    .swagger-ui input[type=password],
    .swagger-ui input[type=email],
    .swagger-ui textarea {
      border: 1px solid #d1d5db;
      border-radius: 6px;
      padding: 0.5rem 0.75rem;
      font-size: 0.875rem;
      background: white;
      color: #374151;
    }
    
    .swagger-ui input[type=text]:focus,
    .swagger-ui input[type=password]:focus,
    .swagger-ui input[type=email]:focus,
    .swagger-ui textarea:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    /* Models section */
    .swagger-ui .model-box {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 1rem;
    }
    
    .swagger-ui .model-title {
      color: #374151;
      font-weight: 600;
    }
    
    /* Authorization modal */
    .swagger-ui .modal-ux {
      background: white;
      border-radius: 8px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      border: 1px solid #e5e7eb;
    }
    
    .swagger-ui .modal-ux-header {
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
      padding: 1rem 1.5rem;
    }
    
    .swagger-ui .modal-ux-content {
      padding: 1.5rem;
    }
    
    /* Scrollbar */
    .swagger-ui ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    
    .swagger-ui ::-webkit-scrollbar-track {
      background: #f3f4f6;
    }
    
    .swagger-ui ::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 4px;
    }
    
    .swagger-ui ::-webkit-scrollbar-thumb:hover {
      background: #9ca3af;
    }
    
    /* Show and style the authorization (security schemes) section */
    .swagger-ui .scheme-container {
      display: block !important;
      margin: 1rem 0 !important;
      padding: 1rem !important;
      background: #f8fafc !important;
      border: 1px solid #e5e7eb !important;
      border-radius: 8px !important;
    }
    .swagger-ui .auth-wrapper {
      display: flex !important;
      align-items: center !important;
      gap: 1rem !important;
    }
    
    /* Custom header styling */
    .swagger-ui .info hgroup.main {
      margin: 0;
    }
    
    .swagger-ui .info hgroup.main a {
      color: #3b82f6;
      text-decoration: none;
    }
    
    .swagger-ui .info hgroup.main a:hover {
      text-decoration: underline;
    }
  `;

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss,
    customSiteTitle: '🚀 API Documentation',
    customfavIcon: 'https://cdn-icons-png.flaticon.com/512/2721/2721297.png',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      tryItOutEnabled: true,
      docExpansion: 'none',
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
      displayOperationId: false,
      showExtensions: true,
      showCommonExtensions: true,
    },
  }));

  // JSON endpoint for the swagger spec
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  console.log('📚 Swagger documentation available at:http://31.97.207.6:8090/api-docs');
};

export default specs;