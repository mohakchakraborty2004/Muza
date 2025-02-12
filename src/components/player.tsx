
 "use client"
import React, { useEffect, useState } from "react";
import { SongQueue, Song } from "@/lib/actions/songQueueManager";

//setQueue([...songQueue.getQueue()]);
const YOUTUBE_API_KEY = "AIzaSyANTeZiA1pE8860x3pHqJoSyyl1llL68Cg";

const songQueue = new SongQueue()

function YouTubePlayer() {
  const [videoId, setVideoId] = useState<string>("");
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [songs, setSongs] = useState<Song[]>(songQueue.getQueue())
  const [add, setAdd] = useState<boolean>(false);
  const [url, setUrl] = useState<string>("")
  const [NextSong, setNextSong] = useState<boolean>(false)

  useEffect(()=> {
    setSongs([...songQueue.getQueue()])
    setAdd(false)
  }, [add])

  useEffect(()=> {
    if(!videoId && !videoTitle){
      return 
    }
    setVideoTitle(songs[0].id);
    setVideoTitle(songs[0].name);
   console.log("-----------------------------------------")
  }, [NextSong])

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
        onChange={(e)=>{
          handleInput(e.currentTarget.value);
          setUrl(e.currentTarget.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleInput(e.currentTarget.value);
          }
        }}
      />
      <button className="bg-white text-black font-extrabold rounded-2xl px-4 ml-5" 
      onClick={()=> {
       const newSong = new Song(videoId, videoTitle, 0, Date.now());
       songQueue.addSong(newSong);
       setAdd(true);
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
            onEnded={()=> {
             setNextSong(true) 
            }}
          ></iframe>
          <button onClick={()=> {
            setNextSong(true);
          }}>next song</button>
        </div>
      )}
    </div>
      
      <div>
        Queue here
        <ul>
    {songs.map((song, index) => (
      <li key={index}>
        {song.name} - Upvotes: {song.upvotes} 
        {/* <button onClick={() => handleUpvote(song.id)}>👍 Upvote</button> */}
      </li>
    ))}
  </ul>
      </div>
    </div>
  
  );
}

export default YouTubePlayer;