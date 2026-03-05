import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { createClient } from '@supabase/supabase-js'
import { toast } from "sonner"

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)

export function CardDemo() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('hello world')
    e.preventDefault()
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    })
    console.log(data)
    console.log(error)
  }
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{isSignUp ? "Create an account" : "Login to your account"}</CardTitle>
        <CardDescription>
          {isSignUp
            ? "Enter your details below to create an account"
            : "Enter your email below to login to your account"}
        </CardDescription>
        <CardAction>
          <Button variant="link" onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? "Login" : "Sign Up"}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            {isSignUp && (
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" type="text" placeholder="John Doe" required />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>

                {!isSignUp && (
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                )}
              </div>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {isSignUp && (
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" required />
              </div>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="button" onClick={handleSubmit} className="w-full">
          {isSignUp ? "Create Account" : "Login"}
        </Button>
      </CardFooter>
    </Card>
  )
}
