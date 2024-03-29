import { moviesResponseById } from '../../../services/moviesService'
import { IMovie } from '../../../types/movie'
import { GlobalDispatch } from '../../store'
import { LOAD_SELECTED_MOVIE } from './constants'
import { SelectedMovieAction } from './types'

export const loadSelectedMovieAction = (movie: IMovie): SelectedMovieAction => {
    return {
        type: LOAD_SELECTED_MOVIE,
        payload: movie
    }
}

const loadSelectedMovieAsyncAction = (id: string | undefined): any => {
    return (dispatch: GlobalDispatch) => {
        moviesResponseById(id).then((movie: IMovie) => dispatch(loadSelectedMovieAction(movie)))
    }
}

export default loadSelectedMovieAsyncAction