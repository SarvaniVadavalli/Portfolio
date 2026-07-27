import React from "react";
import SiteNav from "../components/layout/SiteNav";
import SnapContainer from "../components/layout/SnapContainer";
import SectionWrapper from "../components/layout/SectionWrapper";
import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Skills from "../components/sections/Skills";
import Journey from "../components/sections/Journey";
import Projects from "../components/sections/Projects";
import Certifications from "../components/sections/Certifications";
import Talk from "../components/sections/Talk";
import NeuralBackground from "../components/shared/NeuralBackground";
import NeuralScene3D from "../components/features/NeuralScene3D/NeuralScene3D";
import { SECTIONS } from "../lib/constants";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <NeuralBackground />
      <NeuralScene3D />
      <SiteNav />
      {/* 
        Padding top matches the nav height (64px mobile, 72px desktop) 
        so section content doesn't get obscured underneath the fixed header.
      */}
      <div className="pt-[64px] md:pt-[72px] flex-grow z-10 relative">
        <SnapContainer>
          {SECTIONS.map((section) => {
            if (section.id === "hero") {
              return <Hero key={section.id} />;
            }
            if (section.id === "about") {
              return <About key={section.id} />;
            }
            if (section.id === "skills") {
              return <Skills key={section.id} />;
            }
            if (section.id === "journey") {
              return <Journey key={section.id} />;
            }
            if (section.id === "projects") {
              return <Projects key={section.id} />;
            }
            if (section.id === "certifications") {
              return <Certifications key={section.id} />;
            }
            if (section.id === "talk") {
              return <Talk key={section.id} />;
            }
            return (
              <SectionWrapper
                key={section.id}
                id={section.id}
                title={section.title}
              />
            );
          })}
        </SnapContainer>
      </div>
    </div>
  );
}

