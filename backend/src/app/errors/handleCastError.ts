
import { appError } from "./appError";
const handleCastError = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new appError(message, 400);
};

export default handleCastError;
