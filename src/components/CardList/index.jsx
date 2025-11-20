import styles from './CardList.module.css'


/**
 * @Descrição Usado para renderizar listas genéricas (exemplo: lista de projetos, contratos feitos, etc)
 * Você pode passar uma lista de dados, itens à ser renderizados e uma mensagem default o caso de não haver dados.
 */
function CardList( { renderItem } ) {
    return (
        <div className={styles.dataListComponent}>
            {renderItem.map(i => i)}
        </div>
    )
}

export default CardList;