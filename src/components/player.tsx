"use client"
import React, { useState } from "react";

const YOUTUBE_API_KEY = "AIzaSyANTeZiA1pE8860x3pHqJoSyyl1llL68Cg";

 function YouTubePlayer() {
  const [videoId, setVideoId] = useState<string>("");

  const fetchVideo = async (query: string) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${YOUTUBE_API_KEY}`
      );
      const data = await response.json();

      if (data.items.length > 0) {
        setVideoId(data.items[0].id.videoId);
      } else {
        alert("No video found!");
      }
    } catch (error) {
      console.error("Error fetching video:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <input
        type="text"
        placeholder="Search for a video"
        className="border p-2 mb-2 text-black"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            fetchVideo(e.currentTarget.value);
          }
        }}
      />
      {videoId && (
        <iframe
          className="mt-4"
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube Video Player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}
    </div>
  );
};

export default YouTubePlayer;
