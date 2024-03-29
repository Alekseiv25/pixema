import getTokensUser from '../../../services/authService'
import { fetchRefreshToken, getUser, patchEmail, patchPassword, patchUser } from '../../../services/userService'
import { IBaseActionType, IObjectStringList, ITokenDto, IUserType } from '../../../types/types'
import { GlobalDispatch, GlobalState } from '../../store'
import { GET_ERRORS, GET_TOKEN_FAILED, GET_TOKEN_SUCCESS, GET_USER, SIGN_OUT } from './constants'
import { AuthUserActionType } from './types'

export const getTokensSuccessAction = (
    tokens: ITokenDto
): AuthUserActionType => {
    return {
        type: GET_TOKEN_SUCCESS,
        payload: tokens,
    }
}

export const getTokensFailedAction = (
    errors: IObjectStringList
): AuthUserActionType => {
    return {
        type: GET_TOKEN_FAILED,
        payload: errors,
    }
}

export const getErrorsAction = (errors: IObjectStringList) => {
    return {
        type: GET_ERRORS,
        payload: errors
    }
}

export const getTokensAsyncAction = (email: string, password: string): any => {
    return async (dispatch: GlobalDispatch) => {
        const result = await getTokensUser(email, password)
        if (result.ok) {
            dispatch(getTokensSuccessAction(result.data))
        } else {
            dispatch(getTokensFailedAction(result.data))
        }
    }
}

export const refreshTokenAsyncAction = (): any => {
    return async (dispatch: GlobalDispatch, getState: () => GlobalState) => {
        const refreshToken = getState().auth.tokens?.refresh
        if (!refreshToken) {
            throw new Error('no refresh token')
        }
        const result = await fetchRefreshToken(refreshToken)
        if (result.ok) {
            dispatch(getTokensSuccessAction({
                access: result.data.access,
                refresh: refreshToken
            }))
        }
    }
}

export const getUserAction = (user: IUserType) => {
    return {
        type: GET_USER,
        payload: user
    }
}

export const getUserAsyncAction = (email: string, password: string, cb: () => void): any => {
    return async (dispatch: GlobalDispatch, getState: () => GlobalState) => {
        await dispatch(getTokensAsyncAction(email, password))
        const userData = getState().auth.user?.username
        let accessToken = getState().auth.tokens?.access
        let refreshToken = getState().auth.tokens?.refresh
        const errors = getState().auth.errors

        if (!refreshToken) {
            if (errors) {
                return
            }
            await dispatch(getTokensAsyncAction(email, password))
            await dispatch(getUserAsyncAction(email, password, cb))
        } else if (!accessToken) {
            await dispatch(refreshTokenAsyncAction())
            await dispatch(getUserAsyncAction(email, password, cb))
        } else if (userData === undefined) {
            const userInfo = await getUser(accessToken!)
            dispatch(getUserAction(userInfo.data))
            cb()
        }
    }
}

export const patchUserAsyncAction = (username: string, cb: () => void): any => {
    return async (dispatch: GlobalDispatch, getState: () => GlobalState) => {
        let accessToken = getState().auth.tokens?.access
        if (!accessToken) {
            throw new Error('no Access Token')
        }
        const result = await patchUser(accessToken, username)


        if (result.ok) {
            const userInfo = await getUser(accessToken)
            dispatch(getUserAction(userInfo.data))
            cb()
        } else if (result.status === 401) {
            await dispatch(refreshTokenAsyncAction())
            await dispatch(patchUserAsyncAction(username, cb))
        } else {
            dispatch(getErrorsAction(result.data))
        }
    }
}

export const patchEmailAsyncAction = (password: string, email: string, cb: () => void): any => {
    return async (dispatch: GlobalDispatch, getState: () => GlobalState) => {
        let accessToken = getState().auth.tokens?.access

        if (!accessToken) {
            throw new Error('no Access Token')
        }
        const result = await patchEmail(accessToken, password, email)

        if (result.ok) {
            const userInfo = await getUser(accessToken)
            dispatch(getUserAction(userInfo.data))
            cb()
        } else if (result.status === 401) {
            await dispatch(refreshTokenAsyncAction())
            await dispatch(patchEmailAsyncAction(password, email, cb))
        } else {
            dispatch(getErrorsAction(result.data))
        }
    }
}

export const patchPasswordAsyncAction = (new_password: string, current_password: string, cb: () => void): any => {
    return async (dispatch: GlobalDispatch, getState: () => GlobalState) => {
        let accessToken = getState().auth.tokens?.access

        if (!accessToken) {
            throw new Error('no Access Token')
        }
        const result = await patchPassword(accessToken, current_password, new_password)

        if (result.ok) {
            const userInfo = await getUser(accessToken)
            dispatch(getUserAction(userInfo.data))
            cb()
        } else if (result.status === 401) {
            await dispatch(refreshTokenAsyncAction())
            await dispatch(patchPasswordAsyncAction(current_password, new_password, cb))
        } else {
            throw new Error('error')
        }
    }
}


export const signOutAction = (): IBaseActionType => {
    return {
        type: SIGN_OUT
    }
}