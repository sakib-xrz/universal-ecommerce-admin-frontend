import GlobalProvider from "@/components/shared/global-provider";
import "./globals.css";
import { BASE_URL } from "@/utils/constant";

async function getSettings() {
  try {
    const response = await fetch(`${BASE_URL}/settings`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch settings");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching settings:", error);

    return {
      title: "",
      description: "",
      keywords: "",
      logo: null,
    };
  }
}

export async function generateMetadata() {
  const settings = await getSettings();

  return {
    title: settings.title || "",
    description: settings.description || "",
    keywords: settings.keywords || "",
    icons: {
      icon: settings.logo || "",
    },
    openGraph: {
      title: settings.title || "",
      description: settings.description || "",
      images: [settings.logo || ""],
    },
  };
}

export default async function RootLayout({ children }) {
  const settings = await getSettings();

  return (
    <html lang="en">
      <body className={"antialiased"}>
        <GlobalProvider settings={settings}>{children}</GlobalProvider>
      </body>
    </html>
  );
}
