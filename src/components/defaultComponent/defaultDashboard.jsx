"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { submitContactMessage } from "@/actions/contact";
import Toast from "@/components/Toast/Toast";
import { CONTACT_TOAST } from "@/lib/contactMessages";

import developerImg from "@/assets/developer.jpeg";
import Button from "../Button/Button";
import LoginModal from "../LoginModal/LoginModal";
import styles from "./defaultDashboard.module.css";

const NAV_SECTIONS = ["home", "about", "services", "contact"];

const SERVICES = [
  {
    title: "Web Development",
    description:
      "Fast, scalable websites and web apps built with modern frameworks.",
    icon: "◈",
  },
  {
    title: "Mobile Apps",
    description:
      "Cross-platform experiences with polished UI and reliable performance.",
    icon: "◎",
  },
  {
    title: "UI/UX Design",
    description:
      "User-centered interfaces that look professional and convert visitors.",
    icon: "✦",
  },
  {
    title: "Cloud Solutions",
    description:
      "Secure deployment, hosting, and infrastructure tailored to your scale.",
    icon: "☁",
  },
  {
    title: "Data & Analytics",
    description:
      "Dashboards, KPI tracking, and insights that support smarter decisions.",
    icon: "▣",
  },
  {
    title: "Digital Marketing",
    description:
      "SEO and growth strategies that increase visibility and engagement.",
    icon: "↗",
  },
];

const STATS = [
  { value: "120+", label: "Projects delivered" },
  { value: "8+", label: "Years experience" },
  { value: "98%", label: "Client satisfaction" },
];

const TECH_STACK = {
  engineering: [
    "React",
    "TypeScript",
    "Next.js",
    "Node.js",
    "Go (Golang)",
    "MongoDB",
    "SQL",
    "PostgreSQL",
    "REST & GraphQL",
    "Docker",
    "AWS / Vercel",
  ],
  analytics: [
    "Python",
    "SQL",
    "Power BI",
    "Tableau",
    "Pandas",
    "ETL Pipelines",
    "KPI Dashboards",
    "Forecasting",
    "Microsoft Excel",
    "Google Sheets",
    "Looker Studio",
  ],
};

export default function DefaultDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [contactState, contactFormAction, contactPending] = useActionState(
    submitContactMessage,
    null,
  );
  const [contactToast, setContactToast] = useState(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!contactState) {
      return;
    }

    if (contactState.success) {
      setContactToast({
        variant: "success",
        message: CONTACT_TOAST.success,
      });
      return;
    }

    if (contactState.error) {
      setContactToast({
        variant: "error",
        message: CONTACT_TOAST.error,
      });
    }
  }, [contactState]);

  useEffect(() => {
    if (searchParams.get("login") === "true") {
      setIsModalOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-88px 0px -45% 0px",
        threshold: 0.15,
      },
    );

    NAV_SECTIONS.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="#home" className={styles.logo}>
          TechSolve<span>X</span>
        </Link>

        <nav className={styles.nav} aria-label="Main">
          {NAV_SECTIONS.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className={activeSection === id ? styles.navActive : undefined}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}
        </nav>

        <div className={styles.headerActions}>
          <Button onClick={() => setIsModalOpen(true)}>Login</Button>
          <Link href="/register" className={styles.headerLink}>
            <Button variant="secondary">Register</Button>
          </Link>
        </div>
      </header>

      <section id="home" className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>Software · Data · Growth</span>
          <h1>
            Build smarter products with{" "}
            <span className={styles.heroAccent}>modern technology</span>
          </h1>
          <p className={styles.heroLead}>
            TechSolveX partners with startups and enterprises to design, build,
            and scale digital platforms—from customer-facing apps to analytics
            that drive decisions.
          </p>
          <div className={styles.heroButtons}>
            <a href="#contact" className={styles.ctaPrimary}>
              Start a project
            </a>
            <a href="#services" className={styles.ctaSecondary}>
              View services
            </a>
          </div>
          <ul className={styles.stats}>
            {STATS.map((stat) => (
              <li key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.heroImageFrame}>
            <Image
              src={developerImg}
              alt="Team collaborating on technology projects"
              fill
              sizes="(max-width: 900px) 100vw, 480px"
              priority
              className={styles.heroImage}
            />
          </div>
          <div className={styles.heroCard}>
            <p>End-to-end delivery</p>
            <span>Strategy → Design → Build → Launch</span>
          </div>
        </div>
      </section>

      <section id="about" className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>About us</span>
          <h2>Technology partner you can trust</h2>
          <p>
            We combine engineering excellence with clear communication, so every
            release is reliable, secure, and aligned with your business goals.
          </p>
        </div>

        <div className={styles.aboutCards}>
          <article className={styles.aboutCard}>
            <div className={styles.aboutIcon}>M</div>
            <h3>Mission</h3>
            <p>Deliver innovative software that creates measurable impact.</p>
          </article>
          <article className={styles.aboutCard}>
            <div className={styles.aboutIcon}>V</div>
            <h3>Vision</h3>
            <p>Become the long-term tech partner for ambitious teams.</p>
          </article>
          <article className={styles.aboutCard}>
            <div className={styles.aboutIcon}>C</div>
            <h3>Commitment</h3>
            <p>Quality, integrity, and support at every stage of delivery.</p>
          </article>
        </div>
      </section>

      <section
        id="services"
        className={`${styles.section} ${styles.servicesSection}`}
      >
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>Services</span>
          <h2>What we do for your business</h2>
          <p>
            Full-stack capabilities from first prototype to production systems
            your team can scale with confidence.
          </p>
        </div>

        <div className={styles.serviceGrid}>
          {SERVICES.map((service) => (
            <article key={service.title} className={styles.serviceCard}>
              <span className={styles.serviceIcon} aria-hidden>
                {service.icon}
              </span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.expertise}>
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>Expertise</span>
          <h2>Tools we work with every day</h2>
        </div>

        <div className={styles.expertiseGrid}>
          <article className={styles.expertiseCard}>
            <h3>Engineering</h3>
            <p>Modern stacks for web, mobile, APIs, and cloud deployment.</p>
            <ul className={styles.tagList}>
              {TECH_STACK.engineering.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </article>
          <article className={styles.expertiseCard}>
            <h3>Data & intelligence</h3>
            <p>Pipelines, dashboards, and analytics your leaders can act on.</p>
            <ul className={styles.tagList}>
              {TECH_STACK.analytics.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section
        id="contact"
        className={`${styles.section} ${styles.contactSection}`}
      >
        <div className={styles.contactLayout}>
          <div className={styles.contactInfo}>
            <span className={styles.eyebrow}>Contact</span>
            <h2>Let&apos;s talk about your next project</h2>
            <p>
              Tell us what you&apos;re building. We&apos;ll respond within one
              business day with next steps.
            </p>
            <ul className={styles.contactMeta}>
              <li>
                <strong>Email</strong>
                <span>bdxenon17@gmail.com</span>
              </li>
              <li>
                <strong>Location</strong>
                <span>Remote · Worldwide</span>
              </li>
            </ul>
          </div>

          <div className={styles.formWrap}>
            {contactToast ? (
              <Toast
                placement="form"
                variant={contactToast.variant}
                message={contactToast.message}
                onClose={() => setContactToast(null)}
              />
            ) : null}
            <form
              key={contactState?.formKey ?? "contact"}
              className={styles.form}
              action={contactFormAction}
            >
            <input
              type="text"
              name="name"
              placeholder="Your name"
              aria-label="Your name"
              required
              minLength={2}
              disabled={contactPending}
            />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              aria-label="Email address"
              required
              disabled={contactPending}
            />
            <textarea
              name="message"
              rows={5}
              placeholder="Tell us about your project"
              aria-label="Message"
              required
              minLength={10}
              disabled={contactPending}
            />
            <button type="submit" disabled={contactPending}>
              {contactPending ? "Sending…" : "Send message"}
            </button>
            </form>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div>
            <p className={styles.footerBrand}>TechSolveX</p>
            <p className={styles.footerTagline}>
              Software development & data solutions.
            </p>
          </div>
          <div className={styles.footerLinks}>
            <a href="#services">Services</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <Link href="/register">Register</Link>
          </div>
        </div>
        <p className={styles.footerCopy}>
          © 2026 TechSolveX. All rights reserved.
        </p>
      </footer>

      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
