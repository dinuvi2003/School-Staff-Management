import Image from "next/image";
import LoginHeader from "@/components/layout/LoginPage/LoginHeader";
import LoginForm from "@/components/layout/LoginPage/LoginForm";

export default function Home() {
  return (
    <main className="flex items-center justify-center bg-gray-100">
      <div className="mx-4 w-full max-w-5xl">
        <LoginHeader />
        <LoginForm />
      </div>
    </main>
  );
}
