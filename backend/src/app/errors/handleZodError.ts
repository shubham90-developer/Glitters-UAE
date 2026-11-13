// handleZodError.ts
import { ZodError, ZodIssue } from 'zod';
import { appError } from "./appError";
const handleZodError = (err: ZodError) => {
    const errors = err.issues.map((e: ZodIssue) => ({ path: e.path.join('. '), message: e.message }));
  const message = 'Invalid input data. ';
  return new appError(message + JSON.stringify(errors), 400);
};

export default handleZodError;
