"use client";
import React, { useEffect, useState, useRef } from "react";
import { SongQueue, Song } from "@/lib/actions/songQueueManager";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const songQueue = new SongQueue();

function YouTubePlayer() {
  const [videoId, setVideoId] = useState<string>("");
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [songs, setSongs] = useState<Song[]>(songQueue.getQueue());
  const [add, setAdd] = useState<boolean>(false);
  const [url, setUrl] = useState<string>("");
  const [next, setNext] = useState<boolean>(false);

  const playerRef = useRef<any>(null);
  const apiReady = useRef<boolean>(false); // Tracks if YT API is loaded

  useEffect(() => {
    setSongs([...songQueue.getQueue()]);
    setAdd(false);
  }, [add]);

  useEffect(() => {
    console.log("----------------------------------------------------------")
    if (!videoId) return;
    loadYouTubeAPI();
    setNext(false);
  }, [videoId, next]);

  // Extract video ID from URL
  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  // Fetch video details
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

  // Load YouTube API
  const loadYouTubeAPI = () => {
    if (typeof window === "undefined") return;

    if (window.YT && window.YT.Player) {
      apiReady.current = true;
      createPlayer();
    } else {
      if (!document.getElementById("youtube-iframe-script")) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        tag.id = "youtube-iframe-script";
        document.body.appendChild(tag);
      }

      // Define the global function YouTube API calls when ready
      (window as any).onYouTubeIframeAPIReady = () => {
        apiReady.current = true;
        createPlayer();
      };
    }
  };

  // Create YouTube Player instance
  const createPlayer = () => {
    if (!apiReady.current || !videoId) return;

    if (playerRef.current) {
      playerRef.current.destroy();
    }

    playerRef.current = new window.YT.Player("youtube-player", {
      videoId: videoId,
      playerVars: {
        autoplay: 1,
        controls: 1,
      },
      events: {
        onStateChange: onPlayerStateChange,
      },
    });
  };

  // Play next song when video ends
  const onPlayerStateChange = (event: any) => {
    if (event.data === 0) {
      console.log("Video ended. Playing next song...");
      console.log("hello from playNextSong")
      // const nextSong = songQueue.getQueue()[0];
      const nextSong = songQueue.getNextSong();
      if (nextSong) {
        console.log(nextSong);
        setVideoId(nextSong.id);
        setVideoTitle(nextSong.name);
        setNext(true);
        setAdd(true);
      }
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
            onChange={(e) => {
              handleInput(e.currentTarget.value);
              setUrl(e.currentTarget.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleInput(e.currentTarget.value);
              }
            }}
          />
          <button
            className="bg-white text-black font-extrabold rounded-2xl px-4 ml-5"
            onClick={() => {
              const newSong = new Song(videoId, videoTitle, 0, Date.now());
              songQueue.addSong(newSong);
              setAdd(true);
            }}
          >
            Add to Queue
          </button>
        </div>

        {videoId && (
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold my-4">{videoTitle}</h2>
            <div id="youtube-player" className="mt-2 w-[560px] h-[315px]"></div>
          </div>
        )}
      </div>

      <div>
        <h2>Queue</h2>
        <ul>
          {songs.map((song, index) => (
            <li key={index}>
              {song.name} - Upvotes: {song.upvotes}
              <button
              onClick={()=> {
                // take the song id 
                // increase the particular song Id's upvote
                songQueue.upvoteSong(song.id);
                setAdd(true)
              }}
              >Upvote</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default YouTubePlayer;
