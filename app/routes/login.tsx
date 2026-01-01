import { FaDollarSign } from "react-icons/fa";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";

export default function Login() {
  return (
    <section>
      <div className="flex flex-col justify-center items-center gap-8 py-10">
        <div className="flex flex-col gap-4 justify-center items-center">
          <div className="bg-blue-500 rounded-md w-fit p-4">
            <FaDollarSign className="size-6 text-white" />
          </div>
          <span className="font-bold text-3xl">Welcome Back</span>
          <span className=" text-neutral-500">
            Sign in to continue managing your finances
          </span>
        </div>
        <div className="space-y-6 p-6 shadow-2xl w-full max-w-xl rounded-lg">
          <div className="space-y-2">
            <p className="font-semibold">Login to your account</p>
            <p className="text-neutral-500">
              Enter your email and password below
            </p>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className=" font-semibold" htmlFor="email">
                Email
              </Label>
              <Input type="email" id="email" />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold" htmlFor="password">
                Password
              </Label>
              <Input type="password" id="password" />
            </div>
            <Button variant="default" className="w-full">
              Sign in
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
