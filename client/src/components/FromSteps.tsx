import { motion } from "framer-motion";

export const FormSteps = ({ step }: { step: number }) => {
  return (
    <div className="flex min-w-xl items-center">
      {/* Step 1  */}
      <div className="w-10 h-10 rounded-full flex justify-center items-center bg-primary text-white border">
        1
      </div>

      {/* Step 2  */}
      <div className="border-y flex-1 h-2 w-auto relative">
        <motion.div
          initial={{ width: step === 3 ? "100%" : "0%" }}
          animate={{ width: step === 2 ? "100%" : undefined }}
          transition={{ duration: 0.7 }}
          className="absolute h-full bg-primary"
        />
      </div>
      <div className="w-10 h-10 border rounded-full relative overflow-hidden">
        <motion.div
          initial={{ x: step === 3 ? 0 : -100 }}
          animate={{ x: step === 2 ? 0 : undefined }}
          transition={{ duration: 1.4 }}
          className={`absolute bg-primary w-full h-full flex items-center justify-center rounded-full`}
        ></motion.div>
        <motion.span
          initial={{ color: step === 3 ? "#ffffff" : "#000000" }}
          animate={{ color: step === 2 ? "#ffffff" : undefined }}
          transition={{ duration: 2.4 }}
          className={` absolute w-full h-full flex justify-center items-center`}
        >
          2
        </motion.span>
      </div>

      {/* Step 3  */}
      <div className="border-y flex-1 h-2 w-auto relative">
        <motion.div
          animate={{ width: step === 3 ? "100%" : "0%" }}
          transition={{ duration: 0.7 }}
          className="absolute h-full bg-primary"
        />
      </div>
      <div className="w-10 h-10 border rounded-full relative overflow-hidden">
        <motion.div
          initial={{ x: -100 }}
          animate={{ x: step === 3 ? 0 : undefined }}
          transition={{ duration: 1.4 }}
          className="absolute bg-primary w-full h-full text-white flex items-center justify-center rounded-full"
        ></motion.div>
        <motion.span
          initial={{ color: "#000000" }}
          animate={{ color: step === 3 ? "#ffffff" : "" }}
          transition={{ duration: 2.4 }}
          className={` absolute w-full h-full flex justify-center items-center`}
        >
          3
        </motion.span>
      </div>
    </div>
  );
};
