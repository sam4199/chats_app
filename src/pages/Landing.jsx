import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, UserPlus } from 'lucide-react';

export default function Landing() {
  // Animation variants for a staggered entrance effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 120, damping: 14 },
    },
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/20 dark:bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/20 dark:bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Central Content Box */}
      <motion.div 
        className="relative z-10 max-w-md w-full flex flex-col items-center text-center space-y-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        
        {/* Brand Area */}
        <div className="flex flex-col items-center space-y-6">
          <motion.div variants={itemVariants} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" className="relative w-28 h-28 drop-shadow-2xl transform transition-transform duration-500 hover:scale-105">
              <defs>
                <linearGradient id="primary" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#9333EA" />
                </linearGradient>
                <linearGradient id="secondary" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EC4899" />
                  <stop offset="100%" stopColor="#E11D48" />
                </linearGradient>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#000000" floodOpacity="0.3"/>
                </filter>
              </defs>
              <path d="M45 15 H 75 C 83.28 15 90 21.72 90 30 V 50 C 90 58.28 83.28 65 75 65 H 65 L 55 75 V 65 C 46.72 65 40 58.28 40 50 V 30 C 40 21.72 46.72 15 45 15 Z" fill="url(#secondary)" />
              <path d="M25 35 H 55 C 63.28 35 70 41.72 70 50 V 70 C 70 78.28 63.28 85 55 85 H 45 L 35 95 V 85 C 26.72 85 20 78.28 20 70 V 50 C 20 41.72 26.72 35 25 35 Z" fill="url(#primary)" filter="url(#shadow)" />
              <circle cx="33" cy="60" r="3.5" fill="white" />
              <circle cx="45" cy="60" r="3.5" fill="white" />
              <circle cx="57" cy="60" r="3.5" fill="white" />
            </svg>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-3">
            <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
              chats
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-sm leading-relaxed">
              Connect, share, and chat instantly with the people who matter most.
            </p>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="w-full space-y-4 pt-2">
          <Link 
            to="/login" 
            className="group flex items-center justify-center w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl shadow-[0_8px_30px_rgb(79,70,229,0.3)] hover:shadow-[0_8px_30px_rgb(79,70,229,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
          >
            <span>Log In</span>
            <ArrowRight className="ml-2 w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
          </Link>
          
          <div className="relative flex py-3 items-center">
            <div className="flex-grow border-t border-gray-200 dark:border-zinc-800"></div>
            <span className="flex-shrink-0 mx-4 text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-200 dark:border-zinc-800"></div>
          </div>

          <Link 
            to="/signup" 
            className="group flex items-center justify-center w-full py-4 px-6 bg-white dark:bg-zinc-900 border-2 border-gray-100 dark:border-zinc-800 hover:border-gray-200 dark:hover:border-zinc-700 text-gray-800 dark:text-gray-100 font-semibold rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 dark:focus-visible:ring-zinc-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
          >
            <UserPlus className="mr-2 w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
            <span>Create an Account</span>
          </Link>
        </motion.div>
        
      </motion.div>
    </div>
  );
}