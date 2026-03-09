import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabaseClient } from "@/lib/supabaseclient"
import { getUserByEmail } from "@/api/user"
import useGlobalContext from "@/hooks/useGlobalContext"
import { useNavigate } from "react-router-dom"

interface LoginCardProps {
  title?: string
  description?: string
}

export function LoginCard({
  title = "Login",
  description = "Sign in to your account",
}: LoginCardProps) {
  // ---------- State ----------
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isForgotPassword, setIsForgotPassword] = useState(false)

  const { setUser } = useGlobalContext()
  const navigate = useNavigate()

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    // Supabase verfication of email and password
    const loginResult = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    })

    if (loginResult.error) {
      setError(loginResult.error.message)
      setLoading(false)
      return
    }

    // Fetch the full user record from our backend
    const userData = await getUserByEmail(email)

    // Store the user in global context so the rest of the app can access it
    setUser(userData)

    // Redirect based on role
    if (userData?.roles?.includes("employee")) {
      navigate("/employee-page")
    } else {
      navigate("/foster-page")
    }

    setLoading(false)
  }

  // ---------- Forgot Password Handler ----------
  // Supabase's built-in password reset sends an email with a reset link
  const handleForgotPassword = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    const { error } = await supabaseClient.auth.resetPasswordForEmail(email)

    if (error) {
      setError(error.message)
    } else {
      setSuccessMessage("Check your email for a password reset link.")
    }

    setLoading(false)
  }

  // ---------- Forgot Password View ----------
  if (isForgotPassword) {
    return (
      <Card className="w-full max-w-lg overflow-hidden rounded-2xl border-0 py-0 gap-0 shadow-xl">
        <div className="bg-gray-800 px-6 py-8">
          <div>
            <CardTitle className="text-2xl font-extrabold text-white">
              Reset Password
            </CardTitle>
            <CardDescription className="mt-1 text-gray-400">
              Enter your email to receive a reset link
            </CardDescription>
          </div>
        </div>
        <CardContent className="px-6 py-8">
          <form onSubmit={handleForgotPassword}>
            <div className="flex flex-col gap-5">
              {/* Error message */}
              {error && (
                <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}
              {/* Success message */}
              {successMessage && (
                <div className="rounded border border-green-200 bg-green-50 p-3 text-sm text-green-600">
                  {successMessage}
                </div>
              )}
              <div className="grid gap-1.5">
                <Label htmlFor="reset-email" className="text-gray-800 font-semibold">
                  Email
                </Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="user@example.com"
                  className="border-gray-300 bg-white focus-visible:ring-amber-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gray-800 text-white font-bold hover:bg-gray-900"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
              <button
                type="button"
                className="text-sm text-gray-500 hover:text-gray-800 underline"
                onClick={() => {
                  setIsForgotPassword(false)
                  setError(null)
                  setSuccessMessage(null)
                }}
              >
                Back to login
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }

  // ---------- Login View ----------
  return (
    <Card className="w-full max-w-sm overflow-hidden rounded-2xl border-0 py-0 gap-0 shadow-xl">
      <div className="bg-gray-800 px-6 py-8">
        <div>
          <CardTitle className="text-2xl font-extrabold text-white">
            {title}
          </CardTitle>
          <CardDescription className="mt-1 text-gray-400">
            {description}
          </CardDescription>
        </div>
      </div>
      <CardContent className="px-6 py-8">
        <form onSubmit={handleLogin}>
          <div className="flex flex-col gap-5">
            {/* Error message — shown when login fails */}
            {error && (
              <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}
            {/* Email field */}
            <div className="grid gap-1.5">
              <Label htmlFor="email" className="text-gray-800 font-semibold">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                className="border-gray-300 bg-white focus-visible:ring-amber-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {/* Password field */}
            <div className="grid gap-1.5">
              <div className="flex items-center">
                <Label htmlFor="password" className="text-gray-800 font-semibold">
                  Password
                </Label>
                <button
                  type="button"
                  className="ml-auto text-sm text-gray-500 underline-offset-4 hover:text-gray-800 hover:underline"
                  onClick={() => {
                    setIsForgotPassword(true)
                    setError(null)
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                className="border-gray-300 bg-white focus-visible:ring-amber-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          {/* Submit button — inside the form so Enter key works */}
          <CardFooter className="px-0 pb-0 pt-6">
            <Button
              type="submit"
              className="w-full bg-gray-800 text-white font-bold hover:bg-gray-900"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}
