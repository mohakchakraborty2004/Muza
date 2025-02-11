
 "use client"
import React, { useState } from "react";

const YOUTUBE_API_KEY = "AIzaSyANTeZiA1pE8860x3pHqJoSyyl1llL68Cg";

function YouTubePlayer() {
  const [videoId, setVideoId] = useState<string>("");
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [songs, setSongs] = useState([])

  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }

    return null;
  };

  const fetchVideoDetails = async (id: string) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${YOUTUBE_API_KEY}`
      );
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        setVideoTitle(data.items[0].snippet.title);
      } else {
        setVideoTitle("Video title not found");
      }
    } catch (error) {
      console.error("Error fetching video details:", error);
      setVideoTitle("Error loading video title");
    }
  };

  const handleInput = (input: string) => {
    const extractedId = extractVideoId(input);
    if (extractedId) {
      setVideoId(extractedId);
      fetchVideoDetails(extractedId);
    } else {
      alert("Please enter a valid YouTube URL");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-7 bg-slate-700">
        <div className="flex flex-col items-center p-4">
          <div className="flex justify-center">
          <input
        type="text"
        placeholder="Paste YouTube video URL"
        className="border p-2 mb-2 text-white bg-slate-950 w-80"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleInput(e.currentTarget.value);
          }
        }}
      />
      <button className="bg-white text-black font-extrabold rounded-2xl px-4 ml-5" 
      onClick={()=> {
        new Song(videoId, videoTitle, 0, Date.now())
      }}
      >Add to Queue</button>
          </div>
      
      {videoId && (
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold my-4">{videoTitle}</h2>
          <iframe
            className="mt-2"
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube Video Player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
      
      <div>
        Queue here
      </div>
    </div>
  
  );
}

export default YouTubePlayer;