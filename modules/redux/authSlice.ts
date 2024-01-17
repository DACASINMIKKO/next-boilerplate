import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IAuthState {
    session: {
        id: string,
        email: string,
        roleId: string,
        isCompleted: boolean
        first_name: string
        last_name: string
    }
    user: {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        photo: object[] | null | string;
        industry: string;
        address: string;
        contact_number: string;
        language: string;
        gender: string;
        country: string
        experiences: object[] | null
        portfolio_file: object[] | null | string;
        portfolio_links: string[] | null
        references: object[] | null
        skills: string[]
        trainings_or_certs: string[] | null
        roleId: string
    };
}

export const initialState: IAuthState = {
    session: {
        id: '',
        email: '',
        roleId: '',
        isCompleted: false,
        first_name: '',
        last_name: '',
    },
    user: {
        id: '',
        email: '',
        first_name: '',
        last_name: '',
        photo: '',
        industry: '',
        address: '',
        contact_number: '',
        language: '',
        gender: '',
        country: '',
        experiences: null,
        portfolio_file: null,
        portfolio_links: null,
        references: null,
        skills: [],
        trainings_or_certs: null,
        roleId: ''
    },

};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<IAuthState>) => {
            state.session = action.payload.session
            state.user = action.payload.user;
        },
    },
});

export const { setAuth } = authSlice.actions;
export const AuthReducer = authSlice.reducer;
