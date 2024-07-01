import SideBar from './SideBar';
import { Outlet } from 'react-router-dom';
import styles from '../css/PageWrap.module.scss';
import {Toaster, toast} from 'react-hot-toast';
import PopupModal from '../PopupModal';
import React, { useState } from 'react';

const notifyError = (msg) => {
  toast.error(`${msg}`, {
    position: 'top-right',
    style: {
      padding: "16px",
      borderRadius: "12px",
      backgroundColor: "#FFF5F2",
      borderColor: "#CF3636",
      color: "#27303A",
      fontFamily: "Poppins, sans-serif",
      fontWeight: "600",
      fontSize: "1.2rem"
    }
  })
};

const notifySuccess = (msg) => {
  toast.success(`${msg}`, {
    position: 'top-right',
    duration: 3000,
    style: {
      padding: "16px",
      borderRadius: "12px",
      backgroundColor: "#F6FFF9",
      borderColor: "#48C1B5",
      color: "#27303A",
      fontFamily: "Poppins, sans-serif",
      fontWeight: "600",
      fontSize: "1.2rem"
    }
  })
};

function PageWrap() {
  const [Popup, setShowPopup] = useState(null);

  const showPopupModal = (Component, ...props)=> {
    const removePopupModal = ()=> {setShowPopup(null)}

    const Popup = ()=> (
      <PopupModal>
        <Component removePopupModal={removePopupModal} notifyError={notifyError} notifySuccess={notifySuccess} {...props[0]} />
      </PopupModal>
    )

    setShowPopup(Popup);
  }

  
  return (
    <main className={styles.main}>
      <SideBar showPopupModal={showPopupModal} />
      <section className={styles.main_page}>
        <Outlet context={{ notifyError, notifySuccess, showPopupModal }} />
      </section>
      <Toaster />
      {Popup && React.cloneElement(Popup)}
    </main>
  );
}

export default PageWrap