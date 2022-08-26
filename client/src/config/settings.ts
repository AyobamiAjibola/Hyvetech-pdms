const settings = {
  api: {
    rest: process.env.REACT_APP_REST_ROOT,
    baseURL: process.env.REACT_APP_SERVER_BASE_URL,
    customerBaseURL: process.env.REACT_APP_CUSTOMER_BASE_URL,
  },
  auth: {
    admin: <string>process.env.REACT_APP_ADMIN_AUTH,
  },
  env: process.env.NODE_ENV,
  roles: ["ADMIN_ROLE", "CUSTOMER_ROLE", "GUEST_ROLE", "USER_ROLE"],
  permissions: [
    "manage_all",

    "create_booking",
    "read_booking",
    "update_booking",
    "delete_booking",

    "create_user",
    "read_user",
    "update_user",
    "delete_user",

    "create_customer",
    "read_customer",
    "update_customer",
    "delete_customer",

    "create_role",
    "read_role",
    "update_role",
    "delete_role",

    "create_plan",
    "read_plan",
    "update_plan",
    "delete_plan",
  ],
  office: {
    primary: "Jiffix Hub",
    secondary: "No. 10, 45 Road, off 1st Avenue Gwarimpa",
  },
  error: {
    message: "Something went wrong. Please try again or contact support",
  },
  slots: [
    { id: 1, time: "9am - 11am", available: true, label: "Morning" },
    { id: 2, time: "11am - 1pm", available: true, label: "Late Morning" },
    { id: 3, time: "1pm - 3pm", available: true, label: "Afternoon" },
    { id: 4, time: "3pm - 5pm", available: true, label: "Late Afternoon" },
  ],
};

export default settings;
