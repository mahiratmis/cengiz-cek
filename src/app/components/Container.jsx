import styles from "../DemoLanding.module.css";

export default function Container({ children }) {
  return <div className={styles.container}>{children}</div>;
}
