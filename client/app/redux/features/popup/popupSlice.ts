import { createSlice } from "@reduxjs/toolkit";

export const popupSlice = createSlice({
  name: "popup",
  initialState: {
    channel: false,
    seemore: false,
  },
  reducers: {
    openChannel: (state) => {
      state.channel = true;
    },
    closeChannel: (state) => {
      state.channel = false;
    },
    openSeeMore: (state) => {
      state.seemore = true;
    },
    closeSeeMore: (state) => {
      state.seemore = false;
    },
  },
});

export const {
  openChannel,
  closeChannel,
  openSeeMore,
  closeSeeMore,
} = popupSlice.actions;

export default popupSlice.reducer;
