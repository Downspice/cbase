"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import TipFilterForm from "@/components/actualForms/tipFilter";
import Fieldset, { FieldsetDemo } from "@/components/customUI/fieldset";
import { SelectField } from "@/components/formFields/SelectField";
import { GeneralOptions, MatchResultOptions } from "@/lib/optionList";
import { InputField } from "@/components/formFields/InputField";

export default function LandingPage() {
  const [displayText, setDisplayText] = useState("");
  const [generalId, setGeneralId] = useState("");
  const [matchResId, setMatchResId] = useState("");

  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const fullText = "TBASE";
  const typingSpeed = 200;
  const deletingSpeed = 150;
  const pauseDuration = 5000;

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    const typeText = () => {
      let currentIndex = 1;
      setDisplayText(fullText[0]);
      setShowCursor(true);

      intervalId = setInterval(() => {
        if (currentIndex < fullText.length) {
          setDisplayText(fullText.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(intervalId);
          setIsTypingComplete(true);

          // Wait 5 seconds, then delete
          timeoutId = setTimeout(() => {
            deleteText();
          }, pauseDuration);
        }
      }, typingSpeed);
    };

    const deleteText = () => {
      setIsTypingComplete(false);
      let currentLength = fullText.length;

      intervalId = setInterval(() => {
        if (currentLength > 0) {
          setDisplayText(fullText.slice(0, currentLength - 1));
          currentLength--;
        } else {
          clearInterval(intervalId);

          // Wait a bit, then retype
          timeoutId = setTimeout(() => {
            typeText();
          }, 500);
        }
      }, deletingSpeed);
    };

    // Start typing
    typeText();

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#f7f5f0]">
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 z-50 w-full bg-[#f7f5f0]/80 backdrop-blur-md transition-all duration-300"
      >
        <div className="mx-auto flex items-center justify-end px-[5%] py-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex items-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-xl border-2 border-[#4a4856] bg-transparent px-7 py-2 font-semibold text-[#3a3947] transition-all duration-300 hover:bg-[#4a4856] hover:text-[#fefdfb]"
            >
              Top Up
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-xl border-2 border-[#4a4856] bg-transparent px-7 py-2 font-semibold text-[#3a3947] transition-all duration-300 hover:bg-[#4a4856] hover:text-[#fefdfb]"
            >
              Notifications
            </motion.button>
            <Separator className="text-primary" orientation="vertical" />
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-xl border-2 border-[#4a4856] bg-transparent px-7 py-2 font-semibold text-[#3a3947] transition-all duration-300 hover:bg-[#4a4856] hover:text-[#fefdfb]"
            >
              Login
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-xl bg-[#f4d03f] px-7 py-2 font-semibold text-[#3a3947] transition-all duration-300 hover:shadow-[0_10px_30px_rgba(244,208,63,0.3)]"
            >
              Sign Up
            </motion.button>
          </motion.div>
        </div>
      </motion.header>

      {/* Animated Wave Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.svg
          animate={{ x: [0, -600, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 w-[200%]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{ height: "100%", opacity: 0.5 }}
        >
          <path
            d="M0,50 C300,100 400,0 600,50 C800,100 900,0 1200,50 L1200,120 L0,120 Z"
            fill="#f4d03f"
            opacity="0.3"
          />
        </motion.svg>
        <motion.svg
          animate={{ x: [0, 600, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 w-[200%]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{ height: "100%", opacity: 0.3 }}
        >
          <path
            d="M0,70 C300,20 500,120 700,70 C900,20 1000,120 1200,70 L1200,120 L0,120 Z"
            fill="#ffa726"
            opacity="0.2"
          />
        </motion.svg>
        <motion.svg
          animate={{ x: [0, -600, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 w-[200%]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{ height: "100%", opacity: 0.4 }}
        >
          <path
            d="M0,30 C250,80 450,30 600,60 C800,90 1000,30 1200,60 L1200,120 L0,120 Z"
            fill="#4a4856"
            opacity="0.15"
          />
        </motion.svg>

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            suppressHydrationWarning
            key={i}
            initial={{ y: 0, x: 0, opacity: 0 }}
            animate={{
              y: [-100, -1000],
              x: [0, Math.random() * 100 - 50],
              opacity: [0, 0.6, 0.6, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 6,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "linear",
            }}
            className="absolute h-1 w-1 rounded-full bg-[#f4d03f]"
            style={{ left: `${Math.random() * 100}%`, bottom: 0 }}
          />
        ))}
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [0, -30, -15, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[10%] top-[15%] z-[5] h-20 w-20 rounded-[20px] bg-[#f4d03f] opacity-60"
      />
      <motion.div
        animate={{
          y: [0, -30, -15, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute right-[15%] top-[25%] z-[5] h-[60px] w-[60px] rounded-full bg-[#ffa726] opacity-60"
      />
      <motion.div
        animate={{
          y: [0, -30, -15, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
        className="absolute bottom-[20%] left-[8%] z-[5] h-[70px] w-[70px] rounded-[15px] bg-[#4a4856] opacity-60"
      />
      <motion.div
        animate={{
          y: [0, -30, -15, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-[30%] right-[10%] z-[5] h-[50px] w-[50px] rounded-full bg-[#f4d03f] opacity-60"
      />

      {/* Hero Section */}
      <section className="relative z-10 flex h-screen items-center justify-center px-[5%]">
        <div className="mx-auto w-full max-w-[1400px] text-center">
          {/* Large CBASE Logo with Typing Effect */}
          <motion.h1
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
            className="mb-8 bg-gradient-to-br from-[#f4d03f] to-[#ffa726] bg-clip-text text-[10rem] font-black leading-none tracking-tighter text-transparent md:text-[7rem] sm:text-[4.5rem]"
          >
            {displayText}
            <AnimatePresence>
              {showCursor && (
                <motion.span
                  initial={{ opacity: 1 }}
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                    times: [0, 0.5, 1],
                  }}
                  exit={{ opacity: 0 }}
                >
                  |
                </motion.span>
              )}
            </AnimatePresence>
          </motion.h1>

          {/* Hero Text */}
          <AnimatePresence>
            {/* {isTypingComplete && ( <></>)} */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mb-6 text-4xl font-bold leading-tight text-[#3a3947] md:text-2xl sm:text-xl"
              >
                Your Complete Tips Generation Software
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mx-auto mb-12 max-w-[700px] text-2xl leading-relaxed text-[#6b6a7a] md:text-xl sm:text-lg sm:px-4"
              >
                Everything you need to generate, analyze, and manage your
                betting tips in one place.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex flex-wrap justify-center gap-6 sm:flex-col sm:px-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-[15px] bg-[#f4d03f] px-12 py-5 text-lg font-semibold text-[#3a3947] transition-all duration-300 hover:shadow-[0_10px_30px_rgba(244,208,63,0.3)] sm:w-full sm:px-8 sm:py-4"
                >
                  Sign Up
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-[15px] border-2 border-[#4a4856] bg-transparent px-12 py-5 text-lg font-semibold text-[#3a3947] transition-all duration-300 hover:bg-[#4a4856] hover:text-[#fefdfb] sm:w-full sm:px-8 sm:py-4"
                >
                  Login
                </motion.button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{
            opacity: { delay: 1.5, duration: 0.6 },
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute bottom-12 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-sm text-[#6b6a7a] sm:bottom-8"
        >
          <span>Scroll to explore</span>
          <span className="text-2xl">↓</span>
        </motion.div>
      </section>
      <section className="relative z-10 flex  flex-col items-center justify-center px-[5%]">
        <div className="flex justify-between w-full">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl font-bold leading-tight text-[#3a3947] md:text-2xl sm:text-xl"
          >
            Sport Categories
          </motion.h2>

          <div className="mx-auto flex items-center justify-end px-[5%] py-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex items-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-xl bg-[#f4d03f] border-2 border-[#f4d03f] px-7 py-2 font-semibold text-[#3a3947] transition-all duration-300 hover:shadow-[0_10px_30px_rgba(244,208,63,0.3)]"
              >
                Football ⚽️
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-xl border-2 border-[#4a4856] bg-transparent px-7 py-2 font-semibold text-[#3a3947] transition-all duration-300 hover:bg-[#4a4856] hover:text-[#fefdfb]"
              >
                Boxing 🥊
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-xl border-2 border-[#4a4856] bg-transparent px-7 py-2 font-semibold text-[#3a3947] transition-all duration-300 hover:bg-[#4a4856] hover:text-[#fefdfb]"
              >
                BasketBall 🏀
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-xl border-2 border-[#4a4856] bg-transparent px-7 py-2 font-semibold text-[#3a3947] transition-all duration-300 hover:bg-[#4a4856] hover:text-[#fefdfb]"
              >
                Tennis 🎾
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* <FieldsetDemo/> */}
        <Fieldset legend="General" variant="gradient" className="mb-2 ">
          <div className="w-full grid grid-cols-1 gap-2  space-x-3 md:grid-cols-2 lg:grid-cols-2  mt-1">
            <SelectField
              className="col-span-2"
              label="General"
              options={GeneralOptions}
              value={generalId}
              onChange={setGeneralId}
              placeholder="Select your country"
            />
            <div className="col-span-1 flex flex-end gap-4">
              <SelectField
                className=""
                label="Home"
                options={MatchResultOptions}
                value={generalId}
                onChange={setMatchResId}
                placeholder="Select your result"
              />
              <InputField label="count" type="number" placeholder="00" />
            </div>
            <div className="col-span-1 flex  flex-end gap-4">
              <SelectField
                className=""
                label="Away"
                options={MatchResultOptions}
                value={generalId}
                onChange={setMatchResId}
                placeholder="Select your result"
              />
              <InputField label="count" type="number" placeholder="00" />
            </div>
            <div className="col-span-1 flex flex-end gap-4">
              <SelectField
                className=""
                label="Home H2H"
                options={MatchResultOptions}
                value={generalId}
                onChange={setMatchResId}
                placeholder="Select your result"
              />
              <InputField label="count" type="number" placeholder="00" />
            </div>
            <div className="col-span-1 flex  flex-end gap-4">
              <SelectField
                className=""
                label="Away H2H"
                options={MatchResultOptions}
                value={generalId}
                onChange={setMatchResId}
                placeholder="Select your result"
              />
              <InputField label="count" type="number" placeholder="00" />
            </div>
          </div>
        </Fieldset>

        <Fieldset legend="League" variant="gradient">
          <div className="w-full grid grid-cols-1 gap-2 space-x-3 md:grid-cols-2 lg:grid-cols-2  mt-1">
            <div className="col-span-1 flex flex-col gap-4">
              <h2>Home</h2>
              <SelectField
                className=""
                label="Goals"
                options={MatchResultOptions}
                value={generalId}
                onChange={setMatchResId}
                placeholder="Select your result"
              />
              <SelectField
                className=""
                label="Position"
                options={MatchResultOptions}
                value={generalId}
                onChange={setMatchResId}
                placeholder="Select your result"
              />
              <SelectField
                className=""
                label="Bookings"
                options={MatchResultOptions}
                value={generalId}
                onChange={setMatchResId}
                placeholder="Select your result"
              />
            </div>
            <div className="col-span-1 flex flex-col gap-4">
              <h2>Away</h2>
              <SelectField
                className=""
                label="Goals"
                options={MatchResultOptions}
                value={generalId}
                onChange={setMatchResId}
                placeholder="Select your result"
              />
              <SelectField
                className=""
                label="Position"
                options={MatchResultOptions}
                value={generalId}
                onChange={setMatchResId}
                placeholder="Select your result"
              />
              <SelectField
                className=""
                label="Bookings"
                options={MatchResultOptions}
                value={generalId}
                onChange={setMatchResId}
                placeholder="Select your result"
              />
            </div>
          </div>
        </Fieldset>

        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="mt-3 rounded-full bg-[#f4d03f] px-12 py-2 text-lg font-semibold text-[#3a3947] transition-all duration-300 hover:shadow-[0_10px_30px_rgba(244,208,63,0.3)] sm:w-full sm:px-8 sm:py-2"
        >
          Generate Tips
        </motion.button>
      </section>
    </div>
  );
}
