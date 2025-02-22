"use client";
import React, { useEffect, useState, useRef } from "react";
import { SongQueue, Song } from "@/lib/actions/songQueueManager";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { useSocket } from "@/lib/hooks/useSocket";
dotenv.config();

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const songQueue = new SongQueue();

function YouTubePlayer({ spaceId }: { spaceId: string | string[] }) {
  const [videoId, setVideoId] = useState<string>("");
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [songs, setSongs] = useState<Song[]>(songQueue.getQueue());
  const [add, setAdd] = useState<boolean>(false);
  const [url, setUrl] = useState<string>("");
  const [next, setNext] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("")

  const playerRef = useRef<any>(null);
  const apiReady = useRef<boolean>(false); // Tracks if YT API is loaded

  const socket = useSocket();



  useEffect(() => {


    if (!socket) { return }
    console.log("socket used twice");
    socket.send(JSON.stringify({
      "action": "join",
      "spaceId": spaceId,
      "message": "joined space"
    }))
    socket.onmessage = (event) => {
      if (typeof event.data === "string") {
        const parsedMessage = JSON.parse(event.data);

        if (parsedMessage.message === "joined space") console.log("space joined client side");

        if (parsedMessage.message === "added song") {
          const newSong = new Song(parsedMessage.content.videoId, parsedMessage.content.videoTitle, 0, parsedMessage.content.date);
          songQueue.addSong(newSong);
          setAdd(true);
          console.log(songQueue.getQueue());
        }

        if (parsedMessage.message === "upvote") {
          songQueue.upvoteSong(parsedMessage.content.songId);
          setAdd(true)
          console.log(songQueue.getQueue());
        }

        if (parsedMessage.message === "link add") {
          handleInput(parsedMessage.content.url);
        }

        if (parsedMessage.message === "next song") {
          const nextSong = songQueue.getNextSong();
          if (nextSong) {
            console.log(nextSong);
            setVideoId(nextSong.id);
            setVideoTitle(nextSong.name);
            setNext(true);
            setAdd(true)
          }
        }
      }
      // socket.send("joined", localstorage.token.username, )

      // "joined" => "{username} has joined"  

    }
  }, [socket])

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

  //username fetch 
  // const fetchUser = () => {
  //   const token = localStorage.getItem("token");

  // }

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

      // this fn defines the global function YouTube API calls when ready
      (window as any).onYouTubeIframeAPIReady = () => {
        apiReady.current = true;
        createPlayer();
      };
    }
  };

  // Creates YouTube Player instance
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
      socket?.send(JSON.stringify({
        "action": "any",
        "message": "next song",
        "spaceId": spaceId
      }));
      console.log("hello from playNextSong")
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
    <div className="grid grid-cols-2 gap-7 bg-black text-white h-[100vh]">
      <div className="flex flex-col items-center p-4">
        <div className="flex justify-center">
          <input
            type="text"
            placeholder="Paste YouTube video URL"
            className="border p-2 mb-2 text-white bg-slate-800 w-80"
            onChange={(e) => {
              handleInput(e.currentTarget.value);
              setUrl(e.currentTarget.value);

              socket?.send(JSON.stringify({
                "action": "any",
                "message": "link add",
                "spaceId": spaceId,
                content: {
                  url: e.currentTarget.value,
                  url1: url
                }
              }))

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

              socket?.send(JSON.stringify({
                "action": "any",
                "message": "added song",
                "spaceId": spaceId,
                content: {
                  videoId: videoId,
                  videoTitle: videoTitle,
                  upvotes: 0,
                  date: Date.now()
                }
              }))

            }}
          >
            Add to Queue
          </button>
        </div>

        {videoId && (
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold my-4">{videoTitle}</h2>
            <div id="youtube-player" className="mt-2 w-[560px] h-[315px] rounded-xl"></div>
          </div>
        )}
      </div>

      <div>
        <h2 className="font-bold text-[4rem]">Queue</h2>

        <ul>
          {songs.map((song, index) => (

            <li key={index}>
              <div className="flex flex-col mt-3 border p-5 bg-slate-950 border-violet-600 rounded-3xl  ">
                <h1 className="text-violet-600 font-bold">
                  {song.name}
                </h1>
                <h2>
                  <span className="text-violet-600 font-semibold">- Upvotes:</span> {song.upvotes}
                </h2>
                <button
                  className="text-white bg-purple-600 rounded-2xl w-[100px] p-1 mt-3 font-bold"
                  onClick={() => {
                    // take the song id 
                    // increase the particular song Id's upvote

                    // songQueue.upvoteSong(song.id);
                    // setAdd(true)

                    socket?.send(JSON.stringify({
                      "action": "any",
                      "message": "upvote",
                      "spaceId": spaceId,
                      content: {
                        songId: song.id
                      }
                    }))

                  }}
                >Upvote</button>
              </div>
            </li>


          ))}
        </ul>
      </div>
    </div>
  );
}

export default YouTubePlayer;