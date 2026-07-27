import React from "react";
import CertificationCard from "../learning/CertificationCard";
import ScrollReveal from "../shared/ScrollReveal";

const CERTIFICATIONS = [
  {
    title: "MongoDB Certified Associate Developer",
    issuer: "Professional Certification",
    subtitle: "Database Development • MongoDB",
    description:
      "Learned database design, CRUD operations, indexing, aggregation framework, and application development using MongoDB.",
    credentialUrl:
      "https://drive.google.com/file/d/1FPTSwaMGOmLnJ9-PTwd5SJB_L25wFf9h/view?usp=drive_link",
  },
  {
    title: "IBM Introduction to Computer Vision",
    issuer: "Coursera",
    subtitle: "Computer Vision • Deep Learning",
    description:
      "Studied image processing, convolutional neural networks, TensorFlow, OpenCV, and modern computer vision fundamentals. This knowledge forms the foundation for my ongoing AI research internship in video compression for Autonomous Driving (AD) and Advanced Driver Assistance Systems (ADAS).",
    credentialUrl:
      "https://www.coursera.org/account/accomplishments/verify/KUNV0NDU1MM7",
  },
];

const EXPLORING_CATEGORIES = [
  {
    category: "Machine Learning",
    topics: ["TensorFlow", "Computer Vision", "Deep Learning"],
  },
  {
    category: "Data Structures & Algorithms",
    topics: ["Advanced DSA", "Problem Solving", "Competitive Programming"],
  },
];

export default function Learning() {
  return (
    <section
      id="learning"
      aria-label="Learning"
      className="w-full min-h-[100dvh] snap-start flex flex-col justify-center border-b border-border-default py-space-16 md:py-space-24 relative"
    >
      <div className="container mx-auto px-space-4 md:px-space-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-space-8 items-start">
          <div className="col-span-1 md:col-span-6 lg:col-span-5 flex flex-col justify-start mb-space-8 md:mb-0">
            <ScrollReveal delay="0">
              <span className="text-text-xs font-bold tracking-[0.1em] text-amber-core uppercase mb-space-4 block">
                LEARNING
              </span>
            </ScrollReveal>
            <ScrollReveal delay="120">
              <h2 className="text-text-3xl md:text-text-5xl font-serif font-semibold text-foreground tracking-tight mb-space-6">
                Always Learning.
              </h2>
            </ScrollReveal>
            <ScrollReveal delay="220">
              <p className="text-text-base text-muted font-sans leading-[1.6] max-w-[62ch] mb-space-8">
                I believe great engineers never stop learning. Alongside
                building projects, I continuously deepen my understanding of
                artificial intelligence, machine learning, software engineering,
                and emerging technologies through certifications, research, and
                hands-on experimentation.
              </p>
            </ScrollReveal>
            <ScrollReveal delay="280">
              <div className="border-l border-amber-core/40 pl-space-4 flex flex-col gap-space-1 font-sans text-text-sm text-muted/70 italic leading-relaxed">
                <span>Learning never stops.</span>
                <span>Every project teaches something new.</span>
              </div>
            </ScrollReveal>
          </div>

          <div className="col-span-1 md:col-span-6 lg:col-span-7 flex flex-col gap-space-12">
            <div className="flex flex-col gap-space-6">
              <ScrollReveal delay="250">
                <h3 className="text-text-xl font-bold text-foreground font-sans tracking-tight">
                  Certifications
                </h3>
              </ScrollReveal>
              <div className="flex flex-col gap-space-6">
                {CERTIFICATIONS.map((cert, index) => (
                  <ScrollReveal
                    key={cert.title}
                    type="card"
                    delay={String(320 + index * 90)}
                  >
                    <CertificationCard
                      title={cert.title}
                      issuer={cert.issuer}
                      subtitle={cert.subtitle}
                      description={cert.description}
                      credentialUrl={cert.credentialUrl}
                    />
                  </ScrollReveal>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-space-6">
              <ScrollReveal delay={String(250 + CERTIFICATIONS.length * 90)}>
                <h3 className="text-text-xl font-bold text-foreground font-sans tracking-tight">
                  Currently Exploring
                </h3>
              </ScrollReveal>

              <div className="flex flex-col gap-space-6">
                {EXPLORING_CATEGORIES.map((cat, index) => (
                  <ScrollReveal
                    key={cat.category}
                    type="card"
                    delay={String(320 + (CERTIFICATIONS.length + index) * 90)}
                  >
                    <div className="flex flex-col gap-space-2">
                      <h4 className="text-text-sm font-semibold text-foreground/90 font-sans tracking-wide">
                        {cat.category}
                      </h4>
                      <div className="flex flex-wrap gap-space-3">
                        {cat.topics.map((topic) => (
                          <span
                            key={topic}
                            className="px-space-4 py-space-2 bg-background border border-border-default hover:text-amber-core hover:border-amber-core rounded-radius-sm text-text-base text-muted cursor-default select-none transition-colors duration-100 ease-in-out"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
