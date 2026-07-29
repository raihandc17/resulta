"use client";
import { useState } from "react";

import DefaultDashboard from "../components/defaultComponent/defaultDashboard";
//import ProtectedDashboard from "./components/private/protectedDashboard";

export default function Home() {
  const [isLoggedin, setIsloggedin] = useState(false);
  return (
    <div>
      <main>
        <div>{isLoggedin ? "logged in" : <DefaultDashboard />}</div>
      </main>
    </div>
  );
}
