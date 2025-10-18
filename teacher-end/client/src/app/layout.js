import "./globals.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "School Staff Management System",
  description: "Secure login and admin portal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        suppressContentEditableWarning
        className={`${poppins.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
