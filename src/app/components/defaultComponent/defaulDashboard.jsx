// import React from "react";

// function ProtectedDashboard() {
//   return <div>Protected dashboard</div>;
// }

// export default ProtectedDashboard;
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import Button from "../Button/Button";
import styles from "./defaultDashboard.module.css";
import LoginModal from "../LoginModal/LoginModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const services = [
    "Web Development",
    "Mobile App Development",
    "UI/UX Design",
    "Cloud Solutions",
    "SEO Optimization",
    "Digital Marketing",
  ];
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get("login") === "true") {
      setIsModalOpen(true);
    }
  }, [searchParams]);

  return (
    <>
      {/* Navbar */}
      <header className={styles.header}>
        <div className={styles.logo}>TechSolveX</div>

        <nav className={styles.nav}>
          <a href="#home">Home</a>
          <a href="#about">About Us</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </nav>

        <div>
          <Button onClick={() => setIsModalOpen(true)}>Login</Button>
          {/* <Button variant="secondary">Register</Button> */}
          <Link href="/register">
            <Button variant="secondary">Register</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Build Your Business With Modern Technology</h1>

          <p>
            We build websites, web applications, mobile apps, and digital
            solutions that help your business grow.
          </p>

          <div className={styles.heroButtons}>
            <button className={styles.primary}>Get Started</button>
            <button className={styles.secondary}>Learn More</button>
          </div>
        </div>

        <div className={styles.heroImage}>
          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=700"
            alt="Developer"
          />
        </div>
      </section>

      {/* About */}
      <section id="about" className={styles.about}>
        <h2>About Us</h2>

        <p>
          We are a software company providing high-quality web development,
          mobile applications, UI/UX design, and cloud solutions for startups
          and enterprises.
        </p>

        <div className={styles.aboutCards}>
          <div className={styles.card}>
            <h3>Mission</h3>
            <p>Deliver innovative software solutions worldwide.</p>
          </div>

          <div className={styles.card}>
            <h3>Vision</h3>
            <p>Become a trusted technology partner for every business.</p>
          </div>

          <div className={styles.card}>
            <h3>Values</h3>
            <p>Quality, Integrity, Innovation, and Customer Success.</p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className={styles.services}>
        <h2>Our Services</h2>

        <div className={styles.serviceGrid}>
          {services.map((service) => (
            <div key={service} className={styles.serviceCard}>
              <h3>{service}</h3>
              <p>
                Professional {service.toLowerCase()} solutions for your
                business.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className={styles.contact}>
        <h2>Contact Us</h2>

        <form className={styles.form}>
          <input type="text" placeholder="Your Name" />

          <input type="email" placeholder="Email Address" />

          <textarea rows="5" placeholder="Your Message"></textarea>

          <button>Send Message</button>
        </form>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2026 TechSolveX. All Rights Reserved.</p>
      </footer>
      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
