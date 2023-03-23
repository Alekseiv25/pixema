import { IData } from "../../../types/data";
import { IMovie, IMovieProps } from "../../../types/movieTypes";
import { IBaseActionType } from "../../../types/types";

export interface IMoviesList {
    docs: IData
}

export interface IMoviesListAction extends IBaseActionType {
    payload: IData

}