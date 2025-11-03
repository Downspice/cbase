"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputField } from "@/components/formFields/InputField";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToSignup?: () => void;
}

export function LoginDialog({ open, onOpenChange, onSwitchToSignup }: LoginDialogProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = login(email, password);

    if (result.success) {
      toast.success("Login successful!", {
        description: `Welcome back, ${result.user?.name || result.user?.email}!`,
      });
      setEmail("");
      setPassword("");
      onOpenChange(false);
    } else {
      toast.error("Login failed", {
        description: result.error || "Invalid credentials",
      });
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#fefdfb] border-[#dddad0] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#3a3947]">
            Welcome Back
          </DialogTitle>
          <DialogDescription className="text-[#6b6a7a]">
            Sign in to your account to continue
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Email"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />

          <InputField
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            {onSwitchToSignup && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onOpenChange(false);
                  onSwitchToSignup();
                }}
                className="w-full sm:w-auto rounded-xl border-2 border-[#4a4856] bg-transparent px-6 py-2 font-semibold text-[#3a3947] transition-all duration-300 hover:bg-[#4a4856] hover:text-[#fefdfb]"
              >
                Sign Up Instead
              </motion.button>
            )}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="w-full sm:w-auto rounded-xl bg-[#f4d03f] px-6 py-2 font-semibold text-[#3a3947] transition-all duration-300 hover:shadow-[0_10px_30px_rgba(244,208,63,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Login"}
            </motion.button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

