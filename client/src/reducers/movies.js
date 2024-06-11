import { FETCH_ALL_MOVIES, FETCH_ALL_MOVIE, CREATE_MOVIE, EDIT_MOVIE, DELETE_MOVIE } from "../constants/actionTypes";

const movieReducer = (state = [], action) => {
    switch(action.type){
        case FETCH_ALL_MOVIES:
            // console.log("FETCH_ALL_MOVIES", action.payload);
            return Array.isArray(action.payload) ? action.payload : state;
        case FETCH_ALL_MOVIE:
            // console.log("FETCH_ALL_MOVIE", action.payload);
            return Array.isArray(action.payload) ? action.payload : state;
        case CREATE_MOVIE:
            // console.log("CREATE_MOVIE", action.payload);
            return [...state, action.payload];
        case EDIT_MOVIE:
            // console.log("EDIT_MOVIE", action.payload);
            return state.map(movie => movie.id === action.payload.id ? action.payload : movie);
        case DELETE_MOVIE:
            // console.log("DELETE_MOVIE", action.payload);
            return state.filter(movie => movie.id !== action.payload);
        default:
            return state;
    }
}

export default movieReducer;
