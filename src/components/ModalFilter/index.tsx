import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { allGenres } from '../../constants/constants'
import { filterAction } from '../../store/reducers/filter/actions'
import { toggleFilterAction } from '../../store/reducers/toggleFilter/reducer'
import { toggleFilterSelector } from '../../store/selectors/selectors'
import CloseButton from '../buttons/CloseButton'
import Input from '../Input'
import Submit from '../Submit'
import styles from './styles.module.scss'

const ModalFilter = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const toggleFilter = useSelector(toggleFilterSelector)
    const [stateYearFrom, setStateYearFrom] = useState('1980')
    const [stateYearTo, setStateYearTo] = useState('2023')
    const [stateRatingFrom, setStateRatingFrom] = useState('1')
    const [stateRatingTo, setStateRatingTo] = useState('10')
    const [sortBy, setSortBy] = useState('rating.kp')
    const [activeUl, setActiveUl] = useState(false)
    const [stateGenre, setStateGenre] = useState('')

    const changeValueYearFrom = (e: React.ChangeEvent<HTMLInputElement>) => {
        const currentValue = e.currentTarget.value
        setStateYearFrom(currentValue)
    }
    const changeValueYearTo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const currentValue = e.currentTarget.value
        setStateYearTo(currentValue)
    }
    const changeValueRatingFrom = (e: React.ChangeEvent<HTMLInputElement>) => {
        const currentValue = e.currentTarget.value
        setStateRatingFrom(currentValue)
    }

    const changeValueRatingTo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const currentValue = e.currentTarget.value
        setStateRatingTo(currentValue)
    }
    const handleClick = () => {
        dispatch(filterAction(sortBy, stateYearFrom, stateYearTo, stateRatingFrom, stateRatingTo, stateGenre))
        navigate('/filter')
        dispatch(toggleFilterAction())
    }

    const resetClick = () => {
        setStateYearFrom('1980')
        setStateYearTo('2023')
        setStateRatingFrom('1')
        setStateRatingTo('10')
        setStateGenre('')
    }

    if (toggleFilter) {
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.overflow = 'auto'
    }

    return (
        <div  className={toggleFilter ? `${styles.modal_container} ${styles.active}` : `${styles.modal_container}`}>
            <div className={toggleFilter ? `${styles.modal_content} ${styles.active}` : `${styles.modal_content}`}>
                <div className={styles.modal_header}>
                    <h2>Фильтр</h2>
                    <CloseButton />
                </div>
                <div className={styles.modal_main}>
                    <div className={styles.sort_by}>
                        <h3>Сортировать по</h3>
                        <div className={styles.sort_container}>
                            <button className={sortBy === 'rating.kp' ? `${styles.active}` : ''} onClick={() => { setSortBy('rating.kp') }}>Рейтинг</button>
                            <button className={sortBy === 'year' ? `${styles.active}` : ''} onClick={() => { setSortBy('year') }}>Год</button>
                        </div>
                    </div>
                    <div className={styles.modal_genres}>
                        <h3>Жанры</h3>
                        <ul className={activeUl ? `${styles.active_ul}` : ''} >
                            <label onClick={() => { setActiveUl(!activeUl) }}>Выбрать жанр</label>
                            {allGenres.map((el) => (
                                <li className={stateGenre === el.value ? `${styles.ulgenre} ${styles.active}` : `${styles.ulgenre}`} key={el.label} onClick={() => setStateGenre(el.value)}>
                                    {el.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={styles.modal_years}>
                        <h3>Годы</h3>
                        <div className={styles.modal_years_container}>
                            <Input type={'text'} label={''} placeholder={'From'} name={'fromyears'} value={stateYearFrom} onChange={changeValueYearFrom} />
                            <Input type={'text'} label={''} placeholder={'To'} name={'toyears'} value={stateYearTo} onChange={changeValueYearTo} />
                        </div>
                    </div>
                    <div className={styles.modal_rating}>
                        <h3>Рейтинг</h3>
                        <div className={styles.modal_rating_container}>
                            <Input type={'text'} label={''} placeholder={'From'} name={'fromrating'} value={stateRatingFrom} onChange={changeValueRatingFrom} />
                            <Input type={'text'} label={''} placeholder={'To'} name={'torating'} value={stateRatingTo} onChange={changeValueRatingTo} />
                        </div>
                    </div>
                </div>
                <div className={styles.modal_footer}>
                    <button onClick={resetClick} className={styles.clear_button}>Очистить фильтр</button>
                    <Submit onClick={handleClick} value={'Показать результат'} />
                </div>
            </div>
        </div>
    )
}

export default ModalFilter
