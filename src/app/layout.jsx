export const metadata = {
  title: "GAINLOG",
  description: "Personal Hypertrophy Tracker with AI Coaching",
  manifest: "/manifest.json",
  themeColor: "#090910",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GAINLOG",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="GAINLOG" />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#090910" }}>
        {children}
      </body>
    </html>
  );
}
