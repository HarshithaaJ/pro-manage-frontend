import styles from "../css/SmallPopup.module.scss";
import Button from "../form-inputs/Button";

function LogoutPopup({
    removePopupModal,
    handleLogout
}) {

  return (
    <div className={styles.small_popup}>
        <h3>Are you sure you want to Logout?</h3>
        <div>
            <Button onClick={handleLogout}>Yes, Logout</Button>
            <button onClick={removePopupModal}>Cancel</button>
        </div>
    </div>
  )
}

export default LogoutPopup