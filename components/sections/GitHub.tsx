"use client";

import React, { useEffect, useState, useRef } from "react";
import ScrollReveal from "../shared/ScrollReveal";

const CACHE_KEY = "github_live_stats";
const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour

export interface GitHubStats {
  publicRepos: number;
  totalStars: number;
  totalForks: number;
  followers: number;
}

const FALLBACK_STATS: GitHubStats = {
  publicRepos: 18,
  totalStars: 4,
  totalForks: 2,
  followers: 5,
};

function solveCubicBezier(p1x: number, p1y: number, p2x: number, p2y: number, x: number): number {
  let t = x;
  for (let i = 0; i < 8; i++) {
    const cx = 3 * p1x;
    const bx = 3 * (p2x - p1x) - cx;
    const ax = 1 - cx - bx;
    const xEst = ((ax * t + bx) * t + cx) * t;
    const dx = xEst - x;
    if (Math.abs(dx) < 1e-4) break;
    const dEst = (3 * ax * t + 2 * bx) * t + cx;
    if (dEst < 1e-5) break;
    t -= dx / dEst;
  }
  const cy = 3 * p1y;
  const by = 3 * (p2y - p1y) - cy;
  const ay = 1 - cy - by;
  return ((ay * t + by) * t + cy) * t;
}

export interface AnimatedCounterProps {
  value: number;
  loading: boolean;
  inView: boolean;
}

function AnimatedCounter({ value, loading, inView }: AnimatedCounterProps) {
  const [count, setCount] = useState<number>(0);
  const hasAnimatedRef = useRef<boolean>(false);

  useEffect(() => {
    if (loading || value === undefined || hasAnimatedRef.current) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setCount(value);
      hasAnimatedRef.current = true;
      return;
    }

    if (!inView) return;

    hasAnimatedRef.current = true;
    const end = value;
    if (isNaN(end)) {
      setCount(value);
      return;
    }

    if (end === 0) {
      setCount(0);
      return;
    }

    const duration = 1350;
    const startTime = performance.now();

    const updateCount = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      const easeProgress = solveCubicBezier(0.4, 0, 0.2, 1, progress);
      const current = Math.floor(easeProgress * end);

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(updateCount);
  }, [value, loading, inView]);

  return <>{loading ? "—" : count}</>;
}

export default function GitHub() {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState<boolean>(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_EXPIRY) {
            setStats(data);
            setLoading(false);
            return;
          }
        }

        const userRes = await fetch(
          "https://api.github.com/users/SarvaniVadavalli"
        );
        if (!userRes.ok) throw new Error("Failed to fetch user profile");
        const userData = await userRes.json();

        const reposRes = await fetch(
          "https://api.github.com/users/SarvaniVadavalli/repos?per_page=100"
        );
        if (!reposRes.ok) throw new Error("Failed to fetch repositories");
        const reposData = await reposRes.json();

        let totalStars = 0;
        let totalForks = 0;
        reposData.forEach((repo: { stargazers_count?: number; forks_count?: number }) => {
          totalStars += repo.stargazers_count || 0;
          totalForks += repo.forks_count || 0;
        });

        const liveStats: GitHubStats = {
          publicRepos: userData.public_repos ?? FALLBACK_STATS.publicRepos,
          totalStars: totalStars,
          totalForks: totalForks,
          followers: userData.followers ?? FALLBACK_STATS.followers,
        };

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data: liveStats,
            timestamp: Date.now(),
          })
        );

        setStats(liveStats);
      } catch (err) {
        console.error("Error fetching live GitHub statistics:", err);
        setStats(FALLBACK_STATS);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  const displayStats = stats || FALLBACK_STATS;

  return (
    <section
      ref={sectionRef}
      id="github"
      aria-label="GitHub"
      className="w-full min-h-[100dvh] snap-start flex flex-col justify-center border-b border-border-default py-space-16 md:py-space-24 relative"
    >
      <div className="container mx-auto px-space-4 md:px-space-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-space-8 items-start">
          <div className="col-span-1 md:col-span-6 lg:col-span-5 flex flex-col justify-start mb-space-8 md:mb-0">
            <ScrollReveal delay="0">
              <span className="text-text-xs font-bold tracking-[0.1em] text-amber-core uppercase mb-space-4 block">
                GITHUB
              </span>
            </ScrollReveal>
            <ScrollReveal delay="120">
              <h2 className="text-text-3xl md:text-text-5xl font-serif font-semibold text-foreground tracking-tight mb-space-6">
                Building in Public.
              </h2>
            </ScrollReveal>
            <ScrollReveal delay="220">
              <p className="text-text-base text-muted font-sans leading-[1.6] max-w-[62ch]">
                I believe consistent learning is best demonstrated through
                building. My GitHub documents experiments, AI research,
                full-stack applications, and the continuous evolution of my
                engineering journey.
              </p>
            </ScrollReveal>
          </div>

          <div className="col-span-1 md:col-span-6 lg:col-span-7">
            <ScrollReveal type="card" delay="320">
              <article className="bg-card-bg border border-border-default hover:border-amber-core rounded-radius-lg p-space-8 shadow-sm flex flex-col gap-space-6 cursor-default select-none text-left transition-colors duration-100 ease-in-out">
                <div className="flex flex-col gap-space-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-text-xl font-bold text-foreground font-sans">
                      GitHub
                    </h3>
                    <svg
                      className="w-6 h-6 text-foreground/80"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                  </div>
                  <div className="text-text-sm text-muted font-sans font-medium">
                    @SarvaniVadavalli
                  </div>
                  <p className="text-text-base text-foreground/80 leading-[1.6] mt-space-1">
                    Building AI, full-stack, and software engineering projects
                    while continuously learning and exploring new technologies.
                  </p>
                </div>

                <div
                  className={`grid grid-cols-2 gap-space-4 border-t border-border-default/45 pt-space-4 transition-all duration-[250ms] ease-in-out ${
                    loading
                      ? "animate-github-loading text-muted/50"
                      : "opacity-100"
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-text-2xl font-bold text-amber-core font-sans">
                      <AnimatedCounter
                        value={displayStats.publicRepos}
                        loading={loading}
                        inView={inView}
                      />
                    </span>
                    <span className="text-text-xs text-muted font-sans mt-space-1">
                      Public Repositories
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-text-2xl font-bold text-amber-core font-sans">
                      <AnimatedCounter
                        value={displayStats.totalStars}
                        loading={loading}
                        inView={inView}
                      />
                    </span>
                    <span className="text-text-xs text-muted font-sans mt-space-1">
                      Stars Earned
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-text-2xl font-bold text-amber-core font-sans">
                      <AnimatedCounter
                        value={displayStats.totalForks}
                        loading={loading}
                        inView={inView}
                      />
                    </span>
                    <span className="text-text-xs text-muted font-sans mt-space-1">
                      Total Forks
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-text-2xl font-bold text-amber-core font-sans">
                      <AnimatedCounter
                        value={displayStats.followers}
                        loading={loading}
                        inView={inView}
                      />
                    </span>
                    <span className="text-text-xs text-muted font-sans mt-space-1">
                      Followers
                    </span>
                  </div>
                </div>

                <div className="flex justify-start border-t border-border-default/45 pt-space-6 mt-space-2">
                  <a
                    href="https://github.com/SarvaniVadavalli"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-space-6 py-space-3 bg-amber-core hover:bg-amber-deep text-background font-semibold rounded-radius-sm shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-amber-core focus:ring-offset-2 transition-colors duration-100 ease-in-out cursor-pointer inline-flex items-center justify-center text-center w-full sm:w-auto text-text-sm active:scale-[0.98]"
                  >
                    View Profile
                  </a>
                </div>
              </article>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
