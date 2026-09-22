"use client";

import * as React from "react";
import { MotionConfig } from "framer-motion";

/**
 * Honors the OS "reduce motion" setting for every Framer Motion
 * animation in the tree (transform + layout animations are disabled;
 * opacity fades remain, which is the recommended graceful fallback).
 */
export function MotionConfigProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
