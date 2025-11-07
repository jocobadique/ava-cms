"use client";

import { ReactNode, useState } from "react";
import { ThemeProvider } from "next-themes";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, theme, App } from "antd";
import { useTheme } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface Props {
  defaultTheme: string;
  children: ReactNode;
}
export default function Providers({ defaultTheme, children }: Props) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <AntdRegistry>
      <ThemeProvider attribute="class" defaultTheme={defaultTheme} enableSystem>
        <AntDesignProvider defaultTheme={defaultTheme}>
          <App notification={{ placement: "top" }}>
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </App>
        </AntDesignProvider>
      </ThemeProvider>
    </AntdRegistry>
  );
}

function AntDesignProvider({ defaultTheme, children }: Props) {
  const { defaultAlgorithm, darkAlgorithm } = theme;
  const { theme: currentTheme = defaultTheme } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm: currentTheme === "light" ? defaultAlgorithm : darkAlgorithm,
        token: {
          // colorPrimary: "#fa8c16",
          // fontSize: 16,
        },
        components: {
          Message: {
            contentPadding: "16px 16px",
            fontSize: 16,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
