import { motion } from "framer-motion";

function dashboardPage() {
  return (
    // animate from bottom to top
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      Dashboard Page
    </motion.div>
  )
}

export default dashboardPage
