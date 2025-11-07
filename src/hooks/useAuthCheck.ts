import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useUserStore } from "@/stores/userStore";

export const useAuthCheck = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);

  useEffect(() => {
    const session = Cookies.get("ava_cms_session");

    if (!session) {
      clearUser();
      router.replace("/");
      return;
    }

    try {
      const parsedSession = JSON.parse(session);
      if (!parsedSession?.jwt?.access) {
        clearUser();
        router.replace("/");
      } else {
        // Set user state in Zustand
        setUser({
          firstName: parsedSession.user?.first_name || "User",
          cms_role: parsedSession.user?.cms_role,
          accessToken: parsedSession.jwt.access,
        });
        setIsLoading(false);
      }
    } catch {
      clearUser();
      router.replace("/");
    }
  }, [router, setUser, clearUser]);

  return isLoading;
};
