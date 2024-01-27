import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type Qr = {
  url: string;
  size: number;
  logoSrc?: string;
};

type QrProps = {
  isLoading: boolean;
  isSuccess: boolean;
  qr: Qr;
};

const initialState: QrProps = {
  isLoading: false,
  isSuccess: false,
  qr: {
    url: "",
    size: 0,
  },
};

const qrSlice = createSlice({
  name: "qr",
  initialState,
  reducers: {
    createQr: (state, action: PayloadAction<Qr>) => {
      state.isLoading = true;
      state.qr.url = action.payload.url;
      state.qr.size = action.payload.size;
      state.qr.logoSrc = action.payload.logoSrc;
      state.isSuccess = true;
      state.isLoading = false;
    },
    removeQr: (state) => {
      state.isSuccess = false;
    }
  },
});

export const { createQr, removeQr } = qrSlice.actions;
export default qrSlice.reducer;
