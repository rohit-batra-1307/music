import * as api from "../api";
import {FETCH_ALL_MOVIES, FETCH_ALL_MOVIE,CREATE_MOVIE, EDIT_MOVIE, DELETE_MOVIE} from "../constants/actionTypes";
 
export const getMovies = (userId) => async (dispatch) =>{
    try{
        const response = await api.fetchMovies(userId);
        const data=response.data;
        dispatch({type: FETCH_ALL_MOVIES, payload: data});
        return response.status;
    } catch(error){
        console.log(error.message)
    }
};
export const getMovie = (userId,value) => async (dispatch) =>{
    try{
        const {data} = await api.fetchMovie(userId,value);
        
        dispatch({type: FETCH_ALL_MOVIE, payload: data});
    } catch(error){
        console.log(error.message)
    }
};

export const createMovie = (movie) => async (dispatch) =>{
    try{
        const response = await api.createMovie(movie);
        const data=response.data;
        dispatch({type: CREATE_MOVIE, payload: data});
        console.log(response.status);
        return response.status;

    } catch(error){
        console.log(error.message);
    }
};

export const editMovie = (id, movie) => async (dispatch) => {
    try{
        const {data} = await api.editMovie(id, movie);
        dispatch({type: EDIT_MOVIE, payload: data});
    } catch(error){
        console.log(error.message);
    }
};

export const deleteMovie = (id) => async(dispatch) => {
    try{
        await api.deleteMovie(id);
        dispatch({type: DELETE_MOVIE, payload: id});
    } catch(error){
        console.log(error.message);
    }
};
