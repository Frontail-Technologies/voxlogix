"use client";

import { AnimatePresence, motion } from "framer-motion";

export function ThemeWhoosh({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          <motion.div
            className="absolute inset-y-[-8%] left-0 w-[44vw] bg-primary/30 blur-3xl"
            initial={{ x: "-65vw", skewX: -10 }}
            animate={{ x: "125vw", skewX: -10 }}
            exit={{ x: "125vw", skewX: -10 }}
            transition={{ duration: 0.42, ease: [0.65, 0, 0.35, 1] }}
          />
          <motion.div
            className="absolute inset-y-0 left-0 w-[36vw] bg-gradient-to-r from-transparent via-primary/55 to-transparent blur-2xl"
            initial={{ x: "-55vw", skewX: -10 }}
            animate={{ x: "130vw", skewX: -10 }}
            exit={{ x: "130vw", skewX: -10 }}
            transition={{ duration: 0.42, ease: [0.65, 0, 0.35, 1] }}
          />
          <motion.div
            className="absolute inset-y-0 left-0 w-[18vw] bg-card/35 blur-xl"
            initial={{ x: "-35vw", skewX: -10 }}
            animate={{ x: "118vw", skewX: -10 }}
            exit={{ x: "118vw", skewX: -10 }}
            transition={{ duration: 0.36, ease: [0.65, 0, 0.35, 1] }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
