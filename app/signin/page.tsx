import { SignInForm } from "@/components/signin-form"

export const metadata = {
  title: "Sign In | Ejiogbe Voices",
  description: "Sign in to your account",
}

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-950">
      <SignInForm />
    </div>
  )
}
