"use client";

import type { EffectCallback } from "react";
import { useEffect, useRef } from "react";

export default function PageVisitTelemetry() {
  const hasSentPing = useRef(false);
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (hasSentPing.current) {
      return;
    }

    let clientId = window.localStorage.getItem("clientId");
    if (!clientId) {
      clientId = "web_" + Math.random().toString(36).slice(2);
      window.localStorage.setItem("clientId", clientId);
    }

    let path = window.location.pathname;
    if (path === "/") {
      path = "/home";
    }

    fetch(
      `/api/telemetry?trigger=page_visit&clientId=${clientId}&value=${path}`,
      {
        method: "GET",
      }
    );
    hasSentPing.current = true;
  }, []);
  return null;
}
