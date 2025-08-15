import React from "react";

export default function VideoBanner() {
  return (
    <div className="px-4 md:px-12 lg:px-24 h-[70vh] mb-16">
      <div className="rounded-2xl bg-neutral-200 w-full h-full overflow-hidden">
        <video
          className="w-full h-full object-cover rounded-2xl"
          src="/video_banner.mp4"
          autoPlay
          loop
          muted
        />
      </div>
    </div>
  );
}
