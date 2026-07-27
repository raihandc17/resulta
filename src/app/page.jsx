"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import DefaultDashboard from "./components/defaultComponent/defaulDashboard";
//import ProtectedDashboard from "./components/private/protectedDashboard";

export default function Home() {
  const [isLoggedin, setIsloggedin] = useState(true);
  return (
    <div>
      <main>
        <div>{isLoggedin ? <DefaultDashboard /> : "logged in"}</div>
      </main>
    </div>
  );
}
