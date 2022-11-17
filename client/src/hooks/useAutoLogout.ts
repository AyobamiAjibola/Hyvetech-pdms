import { useEffect } from "react";

import settings from "../config/settings";
import cookie from "../utils/cookie";

export default function useAutoLogout() {
  useEffect(() => {
    window.addEventListener("beforeunload", () => {
      cookie.clear(settings.auth.admin);
    });
  }, []);
}
