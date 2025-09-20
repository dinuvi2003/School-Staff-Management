import Image from "next/image";
import LoginHeader from "@/components/layout/LoginPage/LoginHeader";
import LoginForm from "../../../components/layout/LoginPage/LoginForm";

export default function Home() {
  return (
    <main className="flex items-center justify-center ">
      <div className=" p-5 mx-4 w-full max-w-5xl">
        <LoginHeader />
        <div className="p-10">
          <LoginForm />
          <p className="mt-4 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} School Staff Portal
          </p>
        </div>
      </div>
    </main>
  );
}
