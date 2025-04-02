/**
 * @copyright 2024 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { Variants } from "framer-motion";

export const fadeIn = {
  start: {
    opacity: 0,
  },
  end: {
    opacity: 1,
    transition: {
      duration: 0.7,
    },
  },
};

export const fadeInUp = {
  start: {
    y: 30,
    opacity: 0,
  },
  end: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
    },
  },
};

export const fadeInRight = {
  start: {
    x: -30,
    opacity: 0,
  },
  end: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
    },
  },
};

export const fadeInLeft = {
  start: {
    x: 30,
    opacity: 0,
  },
  end: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
    },
  },
};

export const fadeInScale = {
  start: {
    scale: 0.8,
    opacity: 0,
  },
  end: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.7,
    },
  },
};

export const staggerContainer = {
  start: {},
  end: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};
