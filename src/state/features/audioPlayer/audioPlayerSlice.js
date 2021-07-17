import { createSlice } from '@reduxjs/toolkit'

const initialSourceState = {
  url: '', // audio url
  id: '', // unique identifier
  duration: 0, // duration in ms
  title: '', // source title
}

export const audioPlayerSlice = createSlice({
  name: 'audioPlayer',
  initialState: {
    source: initialSourceState,
    state: {
      playing: false
    }
  },
  reducers: {
    setSource: (state, action) => {
      state.source = action.payload
    },
    resetSource: (state) => {
      state.source = initialSourceState
    }
  }
})

export const { setSource, resetSource } = audioPlayerSlice.actions

export default audioPlayerSlice.reducer