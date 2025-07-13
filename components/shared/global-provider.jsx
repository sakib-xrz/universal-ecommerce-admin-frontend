"use client";

import { store } from "@/redux/store";
import themeConfig from "@/theme/themeConfig";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { createContext, useContext } from "react";

// Create Settings Context
const SettingsContext = createContext(null);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

export default function GlobalProvider({ children, settings }) {
  return (
    <Provider store={store}>
      <SettingsContext.Provider value={settings}>
        <Toaster position="top-center" richColors />
        <AntdRegistry>
          <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>
        </AntdRegistry>
      </SettingsContext.Provider>
    </Provider>
  );
}
