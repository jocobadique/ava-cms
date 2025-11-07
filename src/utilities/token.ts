import Cookies from "js-cookie";
import { isTokenExpired } from "@/utilities/isTokenExpired";
import { refreshService } from "@/services/refresh";

let isRefreshing = false;

export const getValidToken = async (): Promise<string | undefined> => {
  if (isRefreshing) {
    return undefined;
  }

  isRefreshing = true;
  try {
    const sessionCookie = Cookies.get("ava_cms_session");

    if (!sessionCookie) {
      return undefined;
    }

    const session = JSON.parse(sessionCookie);
    const { jwt, csrf, user } = session;

    if (!jwt?.access || !jwt?.refresh) {
      Cookies.remove("ava_cms_session");
      return undefined;
    }

    if (!isTokenExpired(jwt.access)) {
      return jwt.access;
    }

    if (!isTokenExpired(jwt.refresh)) {
      try {
        const newAccessTokenResponse = await refreshService({
          refresh: jwt.refresh,
        });

        // Extract the new access token from the response
        const newAccessToken = newAccessTokenResponse?.data?.access;

        if (!newAccessToken) {
          throw new Error(
            "Failed to retrieve access token from refresh response"
          );
        }

        // Update the session cookie with the new access token
        const updatedSession = {
          csrf,
          jwt: {
            refresh: jwt.refresh,
            access: newAccessToken,
          },
          user,
        };

        Cookies.set("ava_cms_session", JSON.stringify(updatedSession), {
          expires: 4 / 24,
          secure: true,
          sameSite: "Strict",
        });

        console.log("New Access Token generated:", newAccessToken);
        return newAccessToken;
      } catch (error) {
        console.error("Failed to refresh token:", error);
        Cookies.remove("ava_cms_session");
        return undefined;
      }
    }

    console.warn("Refresh token expired. Logging out.");
    Cookies.remove("ava_cms_session");
    window.location.href = "/";
    return undefined;
  } catch (error) {
    console.error("Error handling session cookie:", error);
    Cookies.remove("ava_cms_session");
    return undefined;
  } finally {
    isRefreshing = false; // Reset flag
  }
};
