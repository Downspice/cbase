"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import TipFilterForm from "@/components/actualForms/tipFilter";
import Fieldset, { FieldsetDemo } from "@/components/customUI/fieldset";
import { SelectField } from "@/components/formFields/SelectField";
import { 
  GeneralOptions, 
  MatchResultOptions, 
  LeagueOptions,
  GoalsOptions,
  PositionOptions,
  BookingsOptions 
} from "@/lib/optionList";
import { InputField } from "@/components/formFields/InputField";
import { useAuth } from "@/hooks/use-auth";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { SignupDialog } from "@/components/auth/SignupDialog";
import { TokenDisplay } from "@/components/auth/TokenDisplay";
import { TokensView } from "@/components/auth/TokensView";
import { TopUpView } from "@/components/auth/TopUpView";
import { NotificationsView } from "@/components/auth/NotificationsView";
import { GeneratedTipsView } from "@/components/tips/GeneratedTipsView";
import { TipDetailView } from "@/components/tips/TipDetailView";
import TipsterReviewView from "@/components/tips/TipsterReviewView";
import TipsterFixturesView from "@/components/tips/TipsterFixturesView";
import { useNotifications } from "@/hooks/use-notifications";
import { useTips } from "@/hooks/use-tips";
import { authService } from "@/lib/auth";
import { notificationService } from "@/lib/notifications";
import { GeneratedTip, TipFilters } from "@/lib/tips";
import { toast } from "sonner";

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

  // Authentication
  const { isAuthenticated, user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [tokensViewOpen, setTokensViewOpen] = useState(false);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [generatedTipsOpen, setGeneratedTipsOpen] = useState(false);
  const [tipDetailOpen, setTipDetailOpen] = useState(false);
  const [selectedTip, setSelectedTip] = useState<GeneratedTip | null>(null);
  const [tipsterViewOpen, setTipsterViewOpen] = useState(false);
  const [tipsterAutoOpened, setTipsterAutoOpened] = useState(false);
  const [tipsterSelectedTipId, setTipsterSelectedTipId] = useState<string | null>(null);
  const [tipsterFixturesOpen, setTipsterFixturesOpen] = useState(false);

  // Auto-open Tipster Workbench once upon tipster login
  useEffect(() => {
    if (isAuthenticated && user?.role === "tipster" && !tipsterAutoOpened) {
      setTipsterViewOpen(true);
      setTipsterAutoOpened(true);
    }
  }, [isAuthenticated, user?.role, tipsterAutoOpened]);
  
  // Form state for filters
  const [generalFilter, setGeneralFilter] = useState("");
  const [homeResult, setHomeResult] = useState("");
  const [homeResultCount, setHomeResultCount] = useState<number | undefined>(undefined);
  const [awayResult, setAwayResult] = useState("");
  const [awayResultCount, setAwayResultCount] = useState<number | undefined>(undefined);
  const [homeGoals, setHomeGoals] = useState("");
  const [homePosition, setHomePosition] = useState("");
  const [homeBookings, setHomeBookings] = useState("");
  const [homeCount, setHomeCount] = useState<number | undefined>(undefined);
  const [awayGoals, setAwayGoals] = useState("");
  const [awayPosition, setAwayPosition] = useState("");
  const [awayBookings, setAwayBookings] = useState("");
  const [awayCount, setAwayCount] = useState<number | undefined>(undefined);
  const [homeH2HResult, setHomeH2HResult] = useState("");
  const [homeH2HCount, setHomeH2HCount] = useState<number | undefined>(undefined);
  const [awayH2HResult, setAwayH2HResult] = useState("");
  const [awayH2HCount, setAwayH2HCount] = useState<number | undefined>(undefined);
  const [leagueFilter, setLeagueFilter] = useState("");

  const { generateTip } = useTips();

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
        <div className="flex mx-auto  items-center justify-between  px-[5%] py-2">
          <div className="bg-linear-to-br from-[#f4d03f] to-[#ffa726] bg-clip-text text-[2rem] font-black leading-none tracking-tighter text-transparent ">
            TBASE
          </div>
          <div className="">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex items-center gap-4"
            >
              {isAuthenticated && (
                <TokenDisplay onClick={() => setTokensViewOpen(true)} />
              )}
              {isAuthenticated && user?.role === "tipster" && (
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTipsterViewOpen(true)}
                  className="rounded-xl border-2 border-[#4a4856] bg-transparent px-7 py-2 font-semibold text-[#3a3947] transition-all duration-300 hover:bg-[#4a4856] hover:text-[#fefdfb]"
                >
                  Tipster Workbench
                </motion.button>
              )}
              {isAuthenticated && (
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setNotificationsOpen(true)}
                  className="rounded-xl border-2 border-[#4a4856] bg-transparent px-7 py-2 font-semibold text-[#3a3947] transition-all duration-300 hover:bg-[#4a4856] hover:text-[#fefdfb] relative"
                >
                  Notifications
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </motion.button>
              )}
              {isAuthenticated && (
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGeneratedTipsOpen(true)}
                  className="rounded-xl border-2 border-[#4a4856] bg-transparent px-7 py-2 font-semibold text-[#3a3947] transition-all duration-300 hover:bg-[#4a4856] hover:text-[#fefdfb]"
                >
                  Generated Tips
                </motion.button>
              )}
              <Separator className="text-primary" orientation="vertical" />
              {isAuthenticated ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      logout();
                      toast.success("Logged out successfully");
                    }}
                    className="rounded-xl border-2 border-[#4a4856] bg-transparent px-7 py-2 font-semibold text-[#3a3947] transition-all duration-300 hover:bg-[#4a4856] hover:text-[#fefdfb]"
                  >
                    {user?.name || user?.email} (Logout)
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setLoginOpen(true)}
                    className="rounded-xl border-2 border-[#4a4856] bg-transparent px-7 py-2 font-semibold text-[#3a3947] transition-all duration-300 hover:bg-[#4a4856] hover:text-[#fefdfb]"
                  >
                    Login
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSignupOpen(true)}
                    className="rounded-xl bg-[#f4d03f] px-7 py-2 font-semibold text-[#3a3947] transition-all duration-300 hover:shadow-[0_10px_30px_rgba(244,208,63,0.3)]"
                  >
                    Sign Up
                  </motion.button>
                </>
              )}
            </motion.div>
          </div>
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
          {/* Large TBASE Logo with Typing Effect */}
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
                  onClick={() => setSignupOpen(true)}
                  className="rounded-[15px] bg-[#f4d03f] px-12 py-5 text-lg font-semibold text-[#3a3947] transition-all duration-300 hover:shadow-[0_10px_30px_rgba(244,208,63,0.3)] sm:w-full sm:px-8 sm:py-4"
                >
                  Sign Up
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setLoginOpen(true)}
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
              value={generalFilter}
              onChange={setGeneralFilter}
              placeholder="Select your country"
            />
            <div className="col-span-1 flex flex-end gap-4">
              <SelectField
                className=""
                label="Home Result"
                options={MatchResultOptions}
                value={homeResult}
                onChange={setHomeResult}
                placeholder="Select result"
              />
              <InputField 
                label="Count" 
                type="number" 
                placeholder="0" 
                value={homeResultCount?.toString() || ""}
                onChange={(e) => setHomeResultCount(e.target.value ? parseInt(e.target.value) : undefined)}
              />
            </div>
            <div className="col-span-1 flex  flex-end gap-4">
              <SelectField
                className=""
                label="Away Result"
                options={MatchResultOptions}
                value={awayResult}
                onChange={setAwayResult}
                placeholder="Select result"
              />
              <InputField 
                label="Count" 
                type="number" 
                placeholder="0" 
                value={awayResultCount?.toString() || ""}
                onChange={(e) => setAwayResultCount(e.target.value ? parseInt(e.target.value) : undefined)}
              />
            </div>
            <div className="col-span-1 flex flex-end gap-4">
              <SelectField
                className=""
                label="Home H2H"
                options={MatchResultOptions}
                value={homeH2HResult}
                onChange={setHomeH2HResult}
                placeholder="Select your result"
              />
              <InputField 
                label="count" 
                type="number" 
                placeholder="00" 
                value={homeH2HCount?.toString() || ""}
                onChange={(e) => setHomeH2HCount(e.target.value ? parseInt(e.target.value) : undefined)}
              />
            </div>
            <div className="col-span-1 flex  flex-end gap-4">
              <SelectField
                className=""
                label="Away H2H"
                options={MatchResultOptions}
                value={awayH2HResult}
                onChange={setAwayH2HResult}
                placeholder="Select your result"
              />
              <InputField 
                label="count" 
                type="number" 
                placeholder="00" 
                value={awayH2HCount?.toString() || ""}
                onChange={(e) => setAwayH2HCount(e.target.value ? parseInt(e.target.value) : undefined)}
              />
            </div>
          </div>
        </Fieldset>

        <Fieldset legend="League" variant="gradient">
          <div className="w-full grid grid-cols-1 gap-2 space-x-3 md:grid-cols-2 lg:grid-cols-2  mt-1">
            <SelectField
              className="col-span-2"
              label="League"
              options={LeagueOptions}
              value={leagueFilter}
              onChange={setLeagueFilter}
              placeholder="Select league"
            />
          </div>
          <div className="w-full grid grid-cols-1 gap-2 space-x-3 md:grid-cols-2 lg:grid-cols-2  mt-1">
            <div className="col-span-1 flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-[#3a3947]">Home</h2>
              <SelectField
                className=""
                label="Goals"
                options={GoalsOptions}
                value={homeGoals}
                onChange={setHomeGoals}
                placeholder="Select goals"
              />
              <SelectField
                className=""
                label="Position"
                options={PositionOptions}
                value={homePosition}
                onChange={setHomePosition}
                placeholder="Select position"
              />
              <SelectField
                className=""
                label="Bookings"
                options={BookingsOptions}
                value={homeBookings}
                onChange={setHomeBookings}
                placeholder="Select bookings"
              />
              <InputField 
                label="Count" 
                type="number" 
                placeholder="0" 
                value={homeCount?.toString() || ""}
                onChange={(e) => setHomeCount(e.target.value ? parseInt(e.target.value) : undefined)}
              />
            </div>
            <div className="col-span-1 flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-[#3a3947]">Away</h2>
              <SelectField
                className=""
                label="Goals"
                options={GoalsOptions}
                value={awayGoals}
                onChange={setAwayGoals}
                placeholder="Select goals"
              />
              <SelectField
                className=""
                label="Position"
                options={PositionOptions}
                value={awayPosition}
                onChange={setAwayPosition}
                placeholder="Select position"
              />
              <SelectField
                className=""
                label="Bookings"
                options={BookingsOptions}
                value={awayBookings}
                onChange={setAwayBookings}
                placeholder="Select bookings"
              />
              <InputField 
                label="Count" 
                type="number" 
                placeholder="0" 
                value={awayCount?.toString() || ""}
                onChange={(e) => setAwayCount(e.target.value ? parseInt(e.target.value) : undefined)}
              />
            </div>
          </div>
        </Fieldset>

        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (!isAuthenticated) {
              toast.info("Authentication Required", {
                description: "Please log in or sign up to generate tips.",
              });
              setSignupOpen(true);
            } else {
              // Check if user has enough tokens
              const tokensNeeded = 5;
              const currentTokens = user?.tokens ?? 0;

              if (currentTokens < tokensNeeded) {
                toast.error("Insufficient Tokens", {
                  description: `You need ${tokensNeeded} tokens to generate tips. You have ${currentTokens} tokens. Please top up.`,
                });
                setTokensViewOpen(true);
                return;
              }

              // Deduct tokens
              const result = authService.deductTokens(tokensNeeded);
              
              if (result.success) {
                // Collect filter data
                const filters: TipFilters = {
                  general: generalFilter || undefined,
                  league: leagueFilter || undefined,
                  home: (homeGoals || homePosition || homeBookings || homeCount !== undefined) ? {
                    result: homeResult || undefined,
                    resultCount: homeResultCount,
                    goals: homeGoals || undefined,
                    position: homePosition || undefined,
                    bookings: homeBookings || undefined,
                    count: homeCount,
                  } : undefined,
                  away: (awayGoals || awayPosition || awayBookings || awayCount !== undefined) ? {
                    result: awayResult || undefined,
                    resultCount: awayResultCount,
                    goals: awayGoals || undefined,
                    position: awayPosition || undefined,
                    bookings: awayBookings || undefined,
                    count: awayCount,
                  } : undefined,
                  homeH2H: (homeH2HResult || homeH2HCount !== undefined) ? {
                    result: homeH2HResult || undefined,
                    count: homeH2HCount,
                  } : undefined,
                  awayH2H: (awayH2HResult || awayH2HCount !== undefined) ? {
                    result: awayH2HResult || undefined,
                    count: awayH2HCount,
                  } : undefined,
                };

                // Generate tip with filters
                const generatedTip = generateTip(filters);

                // Add notification for successful tip generation
                notificationService.addNotification({
                  type: "tip_generation",
                  title: "Tips Generation Successful",
                  message: `Generated ${generatedTip.fixtures.length} fixtures! ${result.remainingTokens} tokens remaining.`,
                });

                toast.success("Tips Generated Successfully", {
                  description: `Generated ${generatedTip.fixtures.length} fixtures! ${result.remainingTokens} tokens remaining.`,
                });
              } else {
                toast.error("Generation Failed", {
                  description: result.error || "Could not start generation",
                });
              }
            }
          }}
          className="mt-3 rounded-full bg-[#f4d03f] px-12 py-2 text-lg font-semibold text-[#3a3947] transition-all duration-300 hover:shadow-[0_10px_30px_rgba(244,208,63,0.3)] sm:w-full sm:px-8 sm:py-2"
        >
          Generate Tips
        </motion.button>
      </section>

      {/* Authentication Dialogs */}
      <LoginDialog
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSwitchToSignup={() => {
          setLoginOpen(false);
          setSignupOpen(true);
        }}
      />
      <SignupDialog
        open={signupOpen}
        onOpenChange={setSignupOpen}
        onSwitchToLogin={() => {
          setSignupOpen(false);
          setLoginOpen(true);
        }}
      />
      
      {/* Token Management Dialogs */}
      <TokensView
        open={tokensViewOpen}
        onOpenChange={setTokensViewOpen}
        onTopUp={() => {
          setTokensViewOpen(false);
          setTopUpOpen(true);
        }}
      />
      <TopUpView
        open={topUpOpen}
        onOpenChange={setTopUpOpen}
      />
      
      {/* Notifications View */}
      {isAuthenticated && (
        <NotificationsView
          open={notificationsOpen}
          onOpenChange={setNotificationsOpen}
        />
      )}
      
      {/* Generated Tips Views */}
      {isAuthenticated && (
        <>
          <TipsterFixturesView
            open={tipsterFixturesOpen}
            onOpenChange={setTipsterFixturesOpen}
            tipId={tipsterSelectedTipId}
          />
          <TipsterReviewView
            open={tipsterViewOpen}
            onOpenChange={setTipsterViewOpen}
            onSelectTip={(tipId) => {
              setTipsterSelectedTipId(tipId);
              // fixtures view opens separately
              setTimeout(() => {
                // slight delay to allow closing animation
                setTipsterFixturesOpen(true);
              }, 50);
            }}
          />
          <GeneratedTipsView
            open={generatedTipsOpen}
            onOpenChange={setGeneratedTipsOpen}
            onTipClick={(tip) => {
              setSelectedTip(tip);
              setTipDetailOpen(true);
            }}
          />
          <TipDetailView
            tip={selectedTip}
            open={tipDetailOpen}
            onOpenChange={setTipDetailOpen}
          />
        </>
      )}
    </div>
  );
}
