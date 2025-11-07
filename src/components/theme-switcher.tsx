"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Cookies from "js-cookie";
import { Spin, Switch } from "antd";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Spin />;
  }
  const handleSetTheme = (theme: string) => {
    setTheme(theme);
    Cookies.set("theme", theme);
  };

  return (
    <Switch
      checked={isDarkMode}
      onChange={(checked) => handleSetTheme(checked ? "dark" : "light")}
      checkedChildren={"☀️"}
      unCheckedChildren={"⛅"}
    />
  );
};
export default ThemeSwitcher;
