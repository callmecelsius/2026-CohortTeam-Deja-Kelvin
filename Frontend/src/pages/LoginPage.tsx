import { LoginCard } from "@/components/shared/loginCard"
import { Link } from "react-router-dom"

export default function LoginPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-100 p-4">
      <div className="flex w-full max-w-lg flex-col items-center gap-4">
        <LoginCard />
        <p className="text-sm text-gray-500">
          Foster parent?{" "}
          <Link
            to="/parent-registration"
            className="text-gray-800 font-semibold hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </main>
  )
}
