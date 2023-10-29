import { notification } from "antd";
import "./notification.css";

export const extractErrors = (error: any) => {
  if (typeof error.response.data.error === "string")
    return [error.response.data.message || error.response.data.error];
  if (error.response) {
    if (error.response.data.error && error.response.data.error.length > 0) {
      return error.response.data.error.map((error: any) => {
        return error.message;
      });
    } else if (error.response.data.message) {
      return [error.response.data.message];
    } else {
      return [error.response.data.error];
    }
  } else {
    return [];
  }
};

export const showError = (response: any) => {
  const errors = extractErrors(response);
  if (errors && errors.length > 0) {
    // You can put your code here to handle the error
    showMessage("Request Failed", errors[0], "error");
  }
};

export const showMessage = (
  title: any,
  description: any,
  type: "error" | "info" | "success" | "warning"
) => {
  notification.open({
    type,
    message: title,
    description: description,
  });
};
