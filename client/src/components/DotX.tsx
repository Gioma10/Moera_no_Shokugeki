import { motion } from "framer-motion";

export const DotX = () => {
  return (
    <div className="w-5 h-5 relative overflow-visible">
      {/* DOT */}
      <motion.span
        className="absolute inset-0 flex items-center justify-center"
        variants={{
          idle: { scale: 1, opacity: 1 },
          hover: { scale: 0.2, opacity: 0 },
        }}
        transition={{ duration: 0.18 }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="3" fill="currentColor" />
        </svg>
      </motion.span>

      {/* X – line 1 */}
      <motion.span
        className="absolute left-0 top-1/2 w-full h-[2px] bg-current"
        variants={{
          idle: { rotate: 0, scaleX: 0, opacity: 0 },
          hover: { rotate: 45, scaleX: 1, opacity: 1 },
        }}
        transition={{ duration: 0.18 }}
        style={{ transformOrigin: "center" }}
      />

      {/* X – line 2 */}
      <motion.span
        className="absolute left-0 top-1/2 w-full h-[2px] bg-current"
        variants={{
          idle: { rotate: 0, scaleX: 0, opacity: 0 },
          hover: { rotate: -45, scaleX: 1, opacity: 1 },
        }}
        transition={{ duration: 0.18 }}
        style={{ transformOrigin: "center" }}
      />
    </div>
  );
};
