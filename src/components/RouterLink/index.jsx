import { Link } from "react-router-dom";
import styles from "./Routerlink.module.css";

function RouterLink({ Route, Title, Type }) {
  const className =
    Type === "btn" ? styles.button : styles.link;

  return <Link to={Route} className={className}>{Title}</Link>;
}

export default RouterLink;
