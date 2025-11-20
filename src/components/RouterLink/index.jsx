import { Link } from "react-router";
import styles from './Routerlink.module.css'

function RouterLink( { Route, Title, Type } ) {

    if (Type === "btn") return ( <Link to={ Route } className={styles.routerlinkBtn}> { Title } </Link> )
    else return ( <Link to={ Route } className={styles.routerlinkDefault}> { Title } </Link> )

}

export default RouterLink;