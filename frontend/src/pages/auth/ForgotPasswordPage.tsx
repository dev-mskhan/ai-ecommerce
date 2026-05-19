import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Loader2, CheckCircle2, ChevronLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { Text } from "@/components/ui/Typography";
import { useAuth } from "@store/hooks/useAuth";
import { riftToast } from "@/components/common/toastContainer";
import type { SubmitHandler, FieldValues } from "react-hook-form";
export const ForgotPasswordPage: React.FC = () => {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("sent");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { forgotPassword, forgotState } = useAuth();

  const handleSend: SubmitHandler<FieldValues> = async (data) => {
    setStatus("sending");
    try {
      await forgotPassword(data).unwrap();
      setStatus("sent");
    } catch (error) {
      riftToast.error("Failed to send password reset link");
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <Link
          to="/login"
          className="flex justify-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 mb-12 transition-all group"
        >
          <ChevronLeft
            size={14}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to Login
        </Link>

        <AnimatePresence mode="wait">
          {status !== "sent" ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div>
                <h1 className="text-4xl font-heading font-black italic tracking-tighter uppercase mb-4">
                  Password <br />{" "}
                  <span className="not-italic font-sans text-sm tracking-[0.5em] font-bold opacity-40">
                    Recovery
                  </span>
                </h1>
                <p className="text-sm font-light text-[#1A1A1A]/60 italic leading-relaxed">
                  Enter your registered email to receive a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit(handleSend)} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 px-1">
                    Email
                  </label>
                  <div className="relative group">
                    <input
                      type="email"
                      placeholder="ENTER EMAIL ADDRESS"
                      className="w-full bg-[#1A1A1A]/5 border border-[#1A1A1A]/5 p-5 text-[10px] font-bold tracking-widest outline-none focus:bg-white focus:border-[#1A1A1A]/10 transition-all uppercase"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email",
                        },
                      })}
                    />
                    <Mail
                      size={14}
                      className="absolute right-5 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none"
                    />
                  </div>
                  {errors.email && (
                    <Text variant="error">
                      {errors.email.message as string}
                    </Text>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full h-14 text-[10px] font-bold uppercase tracking-[0.4em] bg-[#1A1A1A] text-[#FDFCF8] relative overflow-hidden group"
                >
                  <span
                    className={
                      status === "sending" ? "opacity-0" : "opacity-100"
                    }
                  >
                    Send Password Reset Link
                  </span>
                  {status === "sending" && (
                    <Loader2
                      size={18}
                      className="absolute inset-0 m-auto animate-spin"
                    />
                  )}
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8 text-center"
            >
              <div className="w-24 h-24 bg-green-500/10 flex items-center justify-center mx-auto">
                <CheckCircle2 size={40} className="text-green-600" />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-heading font-black italic tracking-tighter uppercase leading-none">
                  Link Sent! <br />
                </h2>
                <p className="text-sm font-light text-[#1A1A1A]/60 italic max-w-sm mx-auto">
                  A verification link has been sent to your email address.
                  Please confirm your identity to continue.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
