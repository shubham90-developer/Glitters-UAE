import express, { Application, Request, Response } from "express";
import router from "./app/routes";
import notFound from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { setupSwagger } from "./app/config/swagger";
import { initializeFirebase } from "./app/config/firebase";
const app: Application = express();
import cors from "cors";

// Initialize Firebase Admin SDK (for both Google Auth and Push Notifications)
try {
  initializeFirebase();
} catch (error) {
  console.warn(
    "⚠️ Firebase not initialized - Google auth and push notifications will not work",
  );
}

// parsers
app.use(express.json());

// CORS configuration for production
app.use(
  cors({
    origin: [
      "http://31.97.207.6:5000",
      "http://31.97.207.6:5001",
      "http://localhost:5000",
      "http://localhost:5001",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      // TUS protocol headers for video uploads
      "Tus-Resumable",
      "Upload-Length",
      "Upload-Metadata",
      "Upload-Offset",
      "Upload-Concat",
      "Upload-Defer-Length",
      "X-HTTP-Method-Override",
      "X-Request-ID",
      "X-Requested-With",
    ],
    exposedHeaders: [
      "Location",
      "Upload-Offset",
      "Upload-Length",
      "Tus-Version",
      "Tus-Resumable",
      "Tus-Max-Size",
      "Tus-Extension",
      "Upload-Metadata",
      "Stream-Media-Id",
    ],
    credentials: true,
  }),
);

// swagger configuration
setupSwagger(app);

// application routes
app.use("/v1/api", router);

const entryRoute = (req: Request, res: Response) => {
  const message = "Surver is running...";
  res.send(message);
};

app.get("/", entryRoute);

//Not Found
app.use(notFound);

app.use(globalErrorHandler);

export default app;
