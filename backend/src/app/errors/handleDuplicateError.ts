
import { TErrorSources, TGenericErrorResponse } from "../interface/error.interface";
const handleDuplicateError = (err: any): TGenericErrorResponse => {
  // check match
  const match = err.message.match(/"([^"]*)"/);

  const extractedMessage = match && match[1];

  const errorSources: TErrorSources = [
    {
      path: "",
      message: `${extractedMessage} is already exists`,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: "Duplicate Entry Error",
    errorSources,
  };
};

export default handleDuplicateError;