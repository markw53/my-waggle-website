import Image from "next/image";
// import Header from "../components/Header";
import LoginScreen from "./pages/login";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/background.png" // Ensure this image exists in src/app
          alt="Background"
          fill
          style={{ objectFit: "cover" }}
          quality={100}
        />
      </div>

      {/* Header */}
      {/*<Header />}

      {/* Main Content - Login Screen */}
      <main className="flex flex-grow items-center justify-center">
        <LoginScreen />
      </main>

      {/* Footer */}
      <footer className="bg-black text-white text-center py-4">
        <p className="text-sm">&copy; {new Date().getFullYear()} Waggle | Devon's Digital Solutions</p>
      </footer>
    </div>
  );
}
