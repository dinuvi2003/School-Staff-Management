import Image from "next/image";

export default function AppHeader({
  logoSrc = "/government-logo.png",
  title = "Sri Lanka School Staff Management System",
  subtitle = "Access your school staff records securely",
}) {
  return (
    <header className="flex flex-col items-center text-center">
      <Image
        src={logoSrc}
        width={64}
        height={64}
        alt="Emblem of Sri Lanka"
        className="mb-4"
        priority
      />
      <h1 className="text-xl sm:text-2xl font-semibold">{title}</h1>
      <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
    </header>
  );
}

