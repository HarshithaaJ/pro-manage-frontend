import styles from "./css/Settings.module.scss";
import PasswordInput from "../components/form-inputs/PasswordInput";
import Button from "../components/form-inputs/Button";
import { useState } from "react";
import { IoPersonOutline } from "react-icons/io5";
import {useAuth} from "../context/user.context.js";
import { updateAccountInfo } from "../apis/auth.js";
import {useOutletContext} from "react-router-dom";

function Settings() {
  const {notifySuccess} = useOutletContext();
  const {user: {name: username}, updateUser} = useAuth();
  const [updateInfo, setUpdateInfo] = useState({
    name: username,
    oldPassword: "",
    newPassword: ""
  })

  const [error, setError] = useState({
    name: "",
    oldPassword: "",
    newPassword: "",
    update: ""
  });
  const [processing, setProcessing] = useState(false);
  
  const handleInputChange = (e)=> {
    const {name, value} = e.target;

    setUpdateInfo((prev)=> ({...prev, [name]: value}))
    error[name] && setError((prev)=> ({...prev, [name]: ""}));
    error["update"] && setError((prev)=> ({...prev, update: ""}));
  }

  const handleErrors = ()=> {
    const updateInfoError = {};

    const {name, oldPassword, newPassword} = updateInfo;

    //Error Handling
    if(!name.trim()) updateInfoError.name="Name can't be empty"
    else if(oldPassword.trim() && !newPassword.trim()) updateInfoError.newPassword="New password is missing"
    else if(!oldPassword.trim() && newPassword.trim()) updateInfoError.oldPassword="Old password is missing"
    else if (oldPassword && newPassword) {
      if(oldPassword.length < 8 || newPassword.length < 8) {
        updateInfoError.oldPassword="Password can't be less than 8 characters"
        updateInfoError.newPassword="Password can't be less than 8 characters"
      }
    }
    
    return Object.keys(updateInfoError).length ? updateInfoError : null;
  }

  const handleAccountUpdate = async(e)=> {
    e.preventDefault();
    setProcessing(true);
    const updateInfoError = handleErrors();
    

    if(updateInfoError) {
      setError((prev)=> ({...prev, ...updateInfoError}));
      setProcessing(false);
      return
    }

    const {data: message, error} = await updateAccountInfo({...updateInfo});
      if(error) {
        setError((prev)=> ({...prev, update: error}));
        setProcessing(false);
        return;
      }
        
    if(updateInfo.name!==username) updateUser({name:updateInfo.name})
    setUpdateInfo({name: updateInfo.name, oldPassword: "", newPassword: ""})
    setProcessing(false);
    notifySuccess(message);
  }
  
  return (
    <div className={styles.settings}>
      <h3>Settings</h3>
      <form onSubmit={handleAccountUpdate}>
        <div>
          <div className={`${styles.form_input} ${error.name ? styles.red_border : ""}`}>
            <IoPersonOutline />
            <input
              type="text"
              name="name"
              value={updateInfo.name}
              onChange={handleInputChange}
              placeholder="Name"
            />
          </div>
          <p className={styles.error}>{error.name}</p>
        </div>
        <div>
          <div className={`${styles.form_input} ${error.oldPassword ? styles.red_border : ""}`}>
            <PasswordInput
              value={updateInfo.oldPassword}
              name="oldPassword"
              placeholder="Old Password"
              onChange={handleInputChange}
            />
          </div>
          <p className={styles.error}>{error.oldPassword}</p>
        </div>
        <div>
          <div className={`${styles.form_input} ${error.newPassword ? styles.red_border : ""}`}>
            <PasswordInput
              value={updateInfo.newPassword}
              name="newPassword"
              placeholder="New Password"
              onChange={handleInputChange}
            />
          </div>
          <p className={styles.error}>{error.newPassword}</p>
        </div>
        <p>{error.update}</p>
        <div
          className={
            (username === updateInfo.name.trim()) &&
            !(updateInfo.oldPassword && updateInfo.newPassword)
              ? styles.disable
              : ""
          }
        >
          <Button type="submit" processing={processing}>
            Update
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Settings