"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { motion } from "framer-motion";
import { InputField } from "@/components/formFields/InputField";
import { toast } from "sonner";
import { authService } from "@/lib/auth";
import { notificationService } from "@/lib/notifications";

interface TopUpViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type PaymentMethod = "bank" | "momo" | null;
type MomoProvider = "mtn" | "telecel" | "airteltigo" | null;

export function TopUpView({ open, onOpenChange }: TopUpViewProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [momoProvider, setMomoProvider] = useState<MomoProvider>(null);
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if (paymentMethod === "momo" && !momoProvider) {
      toast.error("Please select a MoMo provider");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      // For demo purposes, add tokens (1 token = 1 GHS, or similar)
      const tokensToAdd = Math.floor(parseFloat(amount));
      const result = authService.addTokens(tokensToAdd);

      if (result.success) {
        // Add notification for successful token purchase
        const paymentMethodText = paymentMethod === "bank" ? "Bank" : `MoMo (${momoProvider?.toUpperCase()})`;
        notificationService.addNotification({
          type: "token_purchase",
          title: "Token Purchase Successful",
          message: `Added ${tokensToAdd} tokens via ${paymentMethodText}. New balance: ${result.newBalance} tokens`,
        });

        toast.success("Top up successful!", {
          description: `Added ${tokensToAdd} tokens to your account. New balance: ${result.newBalance} tokens`,
        });
        setPaymentMethod(null);
        setMomoProvider(null);
        setAmount("");
        onOpenChange(false);
      } else {
        toast.error("Top up failed", {
          description: result.error || "Could not process top up",
        });
      }

      setIsProcessing(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#fefdfb] border-[#dddad0] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#3a3947]">
            Top Up Tokens
          </DialogTitle>
          <DialogDescription className="text-[#6b6a7a]">
            Choose your payment method to add tokens
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Method Selection */}
          <div>
            <label className="block text-sm font-medium text-[#3a3947] mb-3">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setPaymentMethod("bank");
                  setMomoProvider(null);
                }}
                className={`rounded-xl border-2 px-4 py-3 font-semibold transition-all duration-300 ${
                  paymentMethod === "bank"
                    ? "bg-[#f4d03f] border-[#f4d03f] text-[#3a3947]"
                    : "border-[#4a4856] bg-transparent text-[#3a3947] hover:bg-[#4a4856] hover:text-[#fefdfb]"
                }`}
              >
                🏦 Bank
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setPaymentMethod("momo");
                }}
                className={`rounded-xl border-2 px-4 py-3 font-semibold transition-all duration-300 ${
                  paymentMethod === "momo"
                    ? "bg-[#f4d03f] border-[#f4d03f] text-[#3a3947]"
                    : "border-[#4a4856] bg-transparent text-[#3a3947] hover:bg-[#4a4856] hover:text-[#fefdfb]"
                }`}
              >
                📱 MoMo
              </motion.button>
            </div>
          </div>

          {/* MoMo Provider Selection */}
          {paymentMethod === "momo" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <label className="block text-sm font-medium text-[#3a3947] mb-2">
                Select MoMo Provider
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "mtn", label: "MTN", emoji: "🟡" },
                  { id: "telecel", label: "Telecel", emoji: "🔵" },
                  { id: "airteltigo", label: "AirtelTigo", emoji: "🔴" },
                ].map((provider) => (
                  <motion.button
                    key={provider.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMomoProvider(provider.id as MomoProvider)}
                    className={`rounded-lg border-2 px-3 py-2 text-sm font-semibold transition-all duration-300 ${
                      momoProvider === provider.id
                        ? "bg-[#f4d03f] border-[#f4d03f] text-[#3a3947]"
                        : "border-[#dddad0] bg-transparent text-[#3a3947] hover:border-[#4a4856]"
                    }`}
                  >
                    <div>{provider.emoji}</div>
                    <div className="text-xs">{provider.label}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Amount Input */}
          <InputField
            label="Amount (GHS)"
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            step="0.01"
            disabled={isProcessing || !paymentMethod}
          />

          {amount && paymentMethod && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 rounded-lg bg-[#f4d03f]/10 border border-[#f4d03f]/20"
            >
              <div className="text-sm text-[#6b6a7a] mb-1">You will receive:</div>
              <div className="text-2xl font-bold text-[#3a3947]">
                {Math.floor(parseFloat(amount) || 0)} Tokens
              </div>
              <div className="text-xs text-[#6b6a7a] mt-1">
                1 GHS = 1 Token
              </div>
            </motion.div>
          )}
        </div>

        <DialogFooter>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePayment}
            disabled={isProcessing || !paymentMethod || !amount}
            className="w-full rounded-xl bg-[#f4d03f] px-6 py-2 font-semibold text-[#3a3947] transition-all duration-300 hover:shadow-[0_10px_30px_rgba(244,208,63,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Processing..." : "Complete Payment"}
          </motion.button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

