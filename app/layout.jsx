import GlobalProvider from "@/components/shared/global-provider";
import "./globals.css";

export const metadata = {
  title: "LET'Z GEAR",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={"antialiased"}>
        <GlobalProvider>{children}</GlobalProvider>
      </body>
    </html>
  );
}
