import LayoutContent from "../components/LayoutContent";
import "./globals.css";

export const metadata = {
  title: "Airbnb | Find Your Perfect Stay",
  description: "Browse handpicked homes, save your favourites, and book your next perfect stay with Airbnb.",
  keywords: "airbnb, homes, booking, travel, stay, accommodation",
  openGraph: {
    title: "Airbnb | Find Your Perfect Stay",
    description: "Browse handpicked homes, save your favourites, and book your next perfect stay.",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body>
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}
