import styles from './ComponentContainer.module.css'

function ComponentContainer( { children } ) {
    return (
        <div className={styles.componentContainer}>
            { children }
        </div>
    ) 
}

export default ComponentContainer