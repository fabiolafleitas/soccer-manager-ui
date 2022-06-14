import React from 'react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Toast.module.css';

export default function Toast(props) {
  const { show, updateShowToast, message } = props;

  useEffect(() => {
    if(show){
      const closeToast = setTimeout(() => {
        updateShowToast('');
      }, 2500);

      return function clearToastTimeout() {
        clearTimeout(closeToast);
      }
    }
  }, [show, updateShowToast]);

  return (
    <>
    {
      createPortal(
        <div className={`${styles.snackbar} ${show ? styles.show : ''}`}>
          {message}
        </div>,
      document.getElementById("toast"))
    }
    </>
  );
}