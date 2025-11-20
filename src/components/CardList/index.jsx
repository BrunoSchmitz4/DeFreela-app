import styles from './CardList.module.css'


/**
 * @Descrição Usado para renderizar listas genéricas (exemplo: lista de projetos, contratos feitos, etc)
 * Você pode passar uma lista de dados, itens à ser renderizados e uma mensagem default o caso de não haver dados.
 */
function CardList({ items  = [], emptyMessage = "Nenhum item encontrado." }) {
  if (!items.length) {
    return <p className={styles.empty}>{emptyMessage}</p>;
  }

  return <section className={styles.list}>{ items }</section>;
}

export default CardList;