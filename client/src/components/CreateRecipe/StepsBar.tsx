import { motion } from "framer-motion";
import type { Step } from "@/app/create-recipe/page";

const STEPS = [
  { number: 1, label: "Info" },
  { number: 2, label: "Ingredienti" },
  { number: 3, label: "Preparazione" },
];

const stepIndex: Record<Step, number> = {
  first: 0,
  second: 1,
  third: 2,
};

export const StepsBar = ({ step }: { step: Step }) => {
  const current = stepIndex[step];

  return (
    <div className="flex items-center w-full max-w-sm mx-auto">
      {STEPS.map((s, i) => {
        const isCompleted = i < current;
        const isActive = i === current;

        return (
          <div
            key={s.number}
            className="flex items-center flex-1 last:flex-none"
          >
            {/* Circle */}
            <div className="flex flex-col items-center gap-1">
              <div className="relative w-9 h-9">
                {/* Background circle */}
                <div
                  className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${
                    isCompleted || isActive
                      ? "border-orange-500 bg-orange-500 text-white"
                      : "border-muted-foreground/30 bg-white text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <span className="text-sm font-semibold">{s.number}</span>
                  )}
                </div>

                {/* Active pulse ring */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-orange-400"
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  />
                )}
              </div>

              {/* Label */}
              <span
                className={`text-xs font-medium transition-colors duration-300 ${
                  isActive
                    ? "text-orange-500"
                    : isCompleted
                      ? "text-orange-400"
                      : "text-muted-foreground/50"
                }`}
              >
                {s.label}
              </span>
            </div>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 bg-muted-foreground/20 relative mb-5 overflow-hidden rounded-full">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-orange-500 rounded-full"
                  animate={{ width: i < current ? "100%" : "0%" }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
