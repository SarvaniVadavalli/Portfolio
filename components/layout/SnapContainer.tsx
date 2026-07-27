import React from "react";

export interface SnapContainerProps {
  children?: React.ReactNode;
}

export default function SnapContainer({ children }: SnapContainerProps) {
  return (
    <main className="h-screen overflow-y-scroll snap-y snap-proximity scroll-smooth w-full">
      {children}
    </main>
  );
}
