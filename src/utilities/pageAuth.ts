"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useUserStore } from "@/stores/userStore";

export const usePageAuth = (requiresAuth = true) => {
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);

  useEffect(() => {
    const checkAuth = async () => {
      const session = Cookies.get("ava_cms_session");

      if (!session) {
        clearUser();
        if (requiresAuth) {
          return router.replace("/");
        }
      } else {
        try {
          const parsedSession = JSON.parse(session);
          if (!parsedSession?.jwt?.access) {
            clearUser();
            if (requiresAuth) return router.replace("/");
          } else {
            setUser({
              firstName: parsedSession.user?.first_name || "User",
              cms_role: parsedSession.user?.cms_role,
              accessToken: parsedSession.jwt.access,
            });

            if (!requiresAuth) return router.replace("/dashboard");
          }
        } catch {
          clearUser();
          if (requiresAuth) return router.replace("/");
        }
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [requiresAuth, router, setUser, clearUser]);

  return isChecking;
};
