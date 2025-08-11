// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function NetworkErrorPage() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 120 }}
        className="mb-6 text-center"
      >
        <AlertTriangle className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-2 text-white">Connection Lost</h1>
        <p className="text-lg text-gray-400 max-w-md">
          We couldn't connect to our servers. Please check your internet connection and try again.
        </p>
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Button
          size="lg"
          variant="outline"
          className="px-8 py-6 text-lg bg-transparent border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900 transition-all duration-300"
          onClick={() => window.location.reload()}
        >
          Retry Connection
        </Button>
      </motion.div>
    </motion.div>
  );
}