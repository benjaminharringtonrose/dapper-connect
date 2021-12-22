import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TabState {
  isTradeModalVisible: boolean;
}

const initialState: TabState = {
  isTradeModalVisible: false,
};

const tabSlice = createSlice({
  name: 'tab',
  initialState,
  reducers: {
    setTradeModalVisibility: (
      state,
      action: PayloadAction<{ isVisible: boolean }>,
    ) => {
      const { isVisible } = action.payload;
      state.isTradeModalVisible = isVisible;
    },
  },
});

export const { setTradeModalVisibility } = tabSlice.actions;

export default tabSlice.reducer;
