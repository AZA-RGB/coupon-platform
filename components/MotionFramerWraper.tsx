"use client";

import { motion } from "framer-motion";

// Higher-order component to wrap components with animations
const MotionWrapper = ({ children, animationProps = {} }) => {
  const defaultProps = {};

  return (
    <motion.div {...defaultProps} {...animationProps}>
      {children}
    </motion.div>
  );
};

export default MotionWrapper;
