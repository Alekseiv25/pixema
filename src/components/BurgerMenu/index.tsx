import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import FavoritesSvg from '../../assets/svg/FavoritesSvg'
import HomeSvg from '../../assets/svg/HomeSvg'
import SettingSvg from '../../assets/svg/SettingSvg'
import { pathnames } from '../../constants/constants'
import { toggleBurgerSelector } from '../../store/selectors/selectors'
import styles from './styles.module.scss'

const BurgerMenu = () => {
    const location = useLocation()
    const toggleBurger = useSelector(toggleBurgerSelector)

    return (
        <div className={toggleBurger ? `${styles.burger_menu} ${styles.active}` : `${styles.burger_menu}`}>
            {
                pathnames.map((path) => (
                    <Link
                        className={(location.pathname === `/${path.value}` ? `${styles.active_link}` : '')
                            || (location.pathname === `/` && path.value === 'home' ? `${styles.active_link}` : '')}
                        key={path.value}
                        to={path.value === 'home' ? '/' : `${path.value}`}
                    >
                        {path.value === 'home' ? <HomeSvg /> : undefined
                            || path.value === 'favorites' ? <FavoritesSvg /> : undefined
                                || path.value === 'settings' ? <SettingSvg /> : undefined
                        }
                        <p>{path.label}</p>
                    </Link>
                ))
            }
        </div >
    )
}

export default BurgerMenu