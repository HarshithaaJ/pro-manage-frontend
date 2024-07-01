import styles from "./css/PopupModal.module.scss";

function PopupModal({children}) {
  return (
    <div className={styles.popup}>
      {children}
    </div>
  )
}

export default PopupModal