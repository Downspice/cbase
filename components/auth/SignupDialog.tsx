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

interface SignupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin?: () => void;
}

export function SignupDialog({ open, onOpenChange, onSwitchToLogin }: SignupDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = signup(email, password, name);

    if (result.success) {
      toast.success("Account created successfully!", {
        description: `Welcome, ${result.user?.name || result.user?.email}!`,
      });
      setName("");
      setEmail("");
      setPassword("");
      onOpenChange(false);
    } else {
      toast.error("Signup failed", {
        description: result.error || "Could not create account",
      });
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#fefdfb] border-[#dddad0] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#3a3947]">
            Create Account
          </DialogTitle>
          <DialogDescription className="text-[#6b6a7a]">
            Sign up to start generating tips and managing your account
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Name (Optional)"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />

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
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            minLength={6}
          />

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            {onSwitchToLogin && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onOpenChange(false);
                  onSwitchToLogin();
                }}
                className="w-full sm:w-auto rounded-xl border-2 border-[#4a4856] bg-transparent px-6 py-2 font-semibold text-[#3a3947] transition-all duration-300 hover:bg-[#4a4856] hover:text-[#fefdfb]"
              >
                Login Instead
              </motion.button>
            )}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="w-full sm:w-auto rounded-xl bg-[#f4d03f] px-6 py-2 font-semibold text-[#3a3947] transition-all duration-300 hover:shadow-[0_10px_30px_rgba(244,208,63,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </motion.button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

