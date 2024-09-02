"use client";

import { useEffect } from "react";

export default function PageVisitTelemetry() {
  useEffect(() => {
    if (typeof window === "undefined") {
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
  }, []);
  return null;
}
