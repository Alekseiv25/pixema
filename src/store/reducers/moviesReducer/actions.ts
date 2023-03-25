import { moviesPersonResponseById, moviesResponse } from "../../../services/movies/moviesService";
import { IData } from "../../../types/data";
import { GlobalDispatch } from "../../store";
import { LOAD_MOVIES } from "./constants";
import { IMoviesListAction } from "./types";

const loadMoviesAction = (movies: IData): IMoviesListAction => {
    return {
        type: LOAD_MOVIES,
        payload: movies,
    };
};

const loadMoviesAsyncAction = (limit: number): any => {
    return (dispatch: GlobalDispatch): any => {
        moviesResponse(limit).then((movies: IData) =>
            dispatch(loadMoviesAction(movies)))
    }
}

export const loadMoviesByIdAsyncAction = (limit: number, query: string): any => {
    return (dispatch: GlobalDispatch): any => {
        moviesPersonResponseById(limit, query).then((movies: IData) =>
            dispatch(loadMoviesAction(movies)))
    }
}

export default loadMoviesAsyncAction