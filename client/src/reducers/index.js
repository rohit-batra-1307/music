import { combineReducers } from "redux";
import movies from "./movies"
import authentication from "./authentication"

export default combineReducers({
    movies,
    authentication
});
