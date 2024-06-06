import './App.css'
import { useRef } from 'react'
import VideoPlayer from './VideoPlayer'
import videojs from 'video.js';

function App() {
  const playerRef = useRef(null);
  const videoLink = "http://localhost:8080/uploads/courses/febe0bf1-8587-48a8-97f4-df4e1cf6091d/index.m3u8";
  const videoPlayerOptions = {
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: videoLink,
        type: "application/x-mpegURL"
      }
    ]
  }


  //platyer state
  const handlePlayerReady = (player) => {
    playerRef.current = player;

    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will be dispose.");
    })

  }

  return (
    <>
      <div>
        <h1>Video player</h1>
        <VideoPlayer 
        options={videoPlayerOptions}
        onReady={handlePlayerReady}
        />
      </div>
    </>
  )
}

export default App
