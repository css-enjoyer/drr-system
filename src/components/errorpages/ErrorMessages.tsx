
interface ErrorMessage {
  title: string;
  message: string;
}

const ErrorMessages: Record<string, ErrorMessage> = {
  error404: {
    title: "Error 404: Page Not Found",
    message: "Sorry, the page you are looking for does not exist.",
  },
  error403: {
    title: "Error 403: Access Forbidden",
    message: "Sorry, you don't have permission to access this page.",
  },
  error500: {
    title: "Error 500: Internal Server Error",
    message: "Something went wrong on our end. We're working to fix it. Please try again later.",
  },
  error503: {
    title: "Error 503: Service Unavailable",
    message: "Our service is temporarily unavailable. We're working to restore it as soon as possible. Please try again later.",
  },
};

export default ErrorMessages;
