import { IBaseActionType } from '../../../types/types'
import { defaultValue, TOGGLE_BURGER } from './constants'
import { IBurgerState } from './types'

const burgerMenuReducer = (state: IBurgerState = defaultValue, action: IBaseActionType): IBurgerState => {
    switch (action.type) {
        case TOGGLE_BURGER:
            return {
                isOpen: !state.isOpen
            }
        default:
            return state
    }
}

export default burgerMenuReducer