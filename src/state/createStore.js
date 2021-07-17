import { configureStore } from '@reduxjs/toolkit'
import audioPlayerReducer from './features/audioPlayer/audioPlayerSlice'

// preloadedState will be passed in by the plugin
const prepStore = preloadedState => {
    return configureStore({
        reducer: {
          audioPlayer: audioPlayerReducer
        }
    }, preloadedState)
};

export default prepStore