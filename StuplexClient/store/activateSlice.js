import { createSlice } from "@reduxjs/toolkit";
const initialState={
    name:'',
    role:''
}

export const activateSlice = createSlice({
    name: 'activate',
    initialState,
    reducers: {
        setName: (state, action) => {
            const {name,role}=action.payload;
            state.name = name;
            state.role= role;
        },
        // setAvatar: (state, action) => {
        //     state.avatar = action.payload;
        // },
    },
});

export const { setName } = activateSlice.actions;

export default activateSlice.reducer;