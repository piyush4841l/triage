"use client";

import React from "react";
import { Language } from "@/lib/i18n";

export interface InactivityTimerProps {
  onTimeout: () => void;
  timeoutSeconds?: number;
  warningSeconds?: number;
  lang?: Language;
  voiceGuide?: boolean;
}

export function InactivityTimer(_props: InactivityTimerProps) {
  return null;
}
