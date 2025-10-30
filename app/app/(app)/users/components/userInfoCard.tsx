'use client';

import { motion } from 'framer-motion';
import { Mail, Calendar, Globe, MapPin, Home, Activity, Key, Clock, Shield } from 'lucide-react';

interface UserInfoProps {
  avatar?: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  dateJoined: string;
  lastActive: string;
  tokenRemaining: number;
  country: string;
  lastLogin: string;
  loginType: string;
}

export default function UserInfoCard({
  avatar,
  name,
  email,
  role,
  status,
  dateJoined,
  lastActive,
  tokenRemaining,
  country,
  lastLogin,
  loginType,
}: UserInfoProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const tokenPercentage = (tokenRemaining / 1000) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative mx-auto w-full max-w-md overflow-hidden  "
    >
      {/* Header with gradient background */}
      <div className="relative h-32 overflow-hidden bg-gradient-to-br from-[#f4d03f] via-[#ffa726] to-[#f4d03f]">
        {/* Animated wave pattern */}
        <motion.div
          animate={{ x: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 opacity-30"
        >
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="h-full w-[200%]">
            <path
              d="M0,50 C300,100 400,0 600,50 C800,100 900,0 1200,50 L1200,120 L0,120 Z"
              fill="white"
              opacity="0.5"
            />
          </svg>
        </motion.div>
      </div>

      {/* Avatar */}
      <div className="relative -mt-16 flex justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="relative"
        >
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="h-32 w-32 rounded-full border-4 border-[#fefdfb] object-cover shadow-lg"
            />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-[#fefdfb] bg-gradient-to-br from-[#f4d03f] to-[#ffa726] text-3xl font-bold text-[#3a3947] shadow-lg">
              {getInitials(name)}
            </div>
          )}
          {/* Status indicator */}
          <div className="absolute bottom-2 right-2">
            <div
              className={`h-5 w-5 rounded-full border-4 border-[#fefdfb] ${
                status === 'active' ? 'bg-green-500' : 'bg-gray-400'
              }`}
            />
          </div>
        </motion.div>
      </div>

      {/* User Name and Role */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 text-center"
      >
        <h2 className="text-2xl font-bold text-[#3a3947]">{name}</h2>
        <p className="text-sm text-[#6b6a7a]">{role}</p>
        <div className="mt-2 flex items-center justify-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
              status === 'active'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {status.toUpperCase()}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#f7f5f0] px-3 py-1 text-xs font-semibold text-[#6b6a7a]">
            <Shield className="h-3 w-3" />
            {loginType}
          </span>
        </div>
      </motion.div>

      {/* Basic Information */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 px-6"
      >
        <h3 className="mb-4 text-sm font-bold text-[#3a3947]">Basic Information</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#6b6a7a]">
              <Mail className="h-4 w-4" />
              <span className="text-sm">E-Mail</span>
            </div>
            <span className="text-sm font-medium text-[#3a3947]">{email}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#6b6a7a]">
              <Globe className="h-4 w-4" />
              <span className="text-sm">Country</span>
            </div>
            <span className="text-sm font-medium text-[#3a3947]">{country}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#6b6a7a]">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Date Joined</span>
            </div>
            <span className="text-sm font-medium text-[#3a3947]">{dateJoined}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#6b6a7a]">
              <Activity className="h-4 w-4" />
              <span className="text-sm">Last Active</span>
            </div>
            <span className="text-sm font-medium text-[#3a3947]">{lastActive}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#6b6a7a]">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Last Login</span>
            </div>
            <span className="text-sm font-medium text-[#3a3947]">{lastLogin}</span>
          </div>
        </div>
      </motion.div>

      {/* Token Usage */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 px-6"
      >
        <h3 className="mb-4 text-sm font-bold text-[#3a3947]">Token Usage</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#6b6a7a]">
              <Key className="h-4 w-4" />
              <span className="text-sm">Tokens Remaining</span>
            </div>
            <span className="text-sm font-bold text-[#3a3947]">{tokenRemaining} / 1000</span>
          </div>

          {/* Progress bar */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#dddad0]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${tokenPercentage}%` }}
              transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-[#f4d03f] to-[#ffa726]"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-[#6b6a7a]">
            <span>Usage: {(100 - tokenPercentage).toFixed(1)}%</span>
            <span>Available: {tokenPercentage.toFixed(1)}%</span>
          </div>
        </div>
      </motion.div>

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-6 px-6 pb-6"
      >
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full rounded-xl bg-[#f4d03f] py-3 font-semibold text-[#3a3947]  transition-all duration-300 hover:shadow-[0_10px_30px_rgba(244,208,63,0.3)]"
        >
          View Full Profile
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// Example usage component
export function DummyInfo() {
  const userData = {
    avatar: '/avatar.JPG',
    name: 'Awer Joseph Kweku',
    email: 'joseph.awer@gmail.com',
    role: 'Tiptser',
    status: 'active' as const,
    dateJoined: '26 September 2023',
    lastActive: 'Today, 2:45 PM',
    tokenRemaining: 750,
    country: 'Ghana',
    lastLogin: 'Today, 9:30 AM',
    loginType: 'Email',
  };

  return (
    <div className="h-full ">
      <UserInfoCard {...userData} />
    </div>
  );
}