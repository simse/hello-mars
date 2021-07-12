import React from "react"
import { AudioPlayerProvider } from "react-use-audio-player"
import { Provider as BusProvider } from 'react-bus'

// components
import AudioPlayer from "./audioPlayer"

// markup
export default function Layout({ children }) {
  return (
    <div>
      <BusProvider>
        <AudioPlayerProvider>
          <AudioPlayer file={"https://api.hellomars.show/assets/a8f08f34-b1de-41c6-a913-af7f3690c550"} />

          {children}
        </AudioPlayerProvider>
      </BusProvider>
    </div>
  )
}