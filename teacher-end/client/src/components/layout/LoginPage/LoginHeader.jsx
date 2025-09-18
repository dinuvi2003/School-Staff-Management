import Image from "next/image";

export default function AppHeader({
  logoSrc = "/government-logo.png",
  title = "Sri Lanka School Staff Management System",
  subtitle = "Access your school staff records securely",
}) {
  return (
    <header className="flex flex-col items-center text-center w-4/6 mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold">{title}</h1>
      <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
    </header>
  );
}

