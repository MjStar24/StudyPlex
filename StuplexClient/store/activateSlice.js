import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name:'',
  email: '',
  city: '',
  state: '',
  board: '',
  exam: '',
  class: '',
  role: '',
  isActivated:false
};

const activateSlice = createSlice({
  name: 'activate',
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      const {
        name,
        email,
        city,
        state: userState,
        board,
        exam,
        class: userClass,
        role,
        isActivated
      } = action.payload;

      state.name = name;
      state.email = email ;
      state.city = city ;
      state.state = userState ;
      state.board = board;
      state.exam = exam;
      state.class = userClass;
      state.role= role;
      state.isActivated=isActivated;
    },
  },
});

export const { setUserDetails, } = activateSlice.actions;

export default activateSlice.reducer;