import { useEffect } from "react";
import styes from "../css/Select.module.scss";

export default function Select({children, setShowSelect}) {

  useEffect(() => {
    window.addEventListener("click", () => {
      setShowSelect(false);
    });
    
    return () => {
      window.removeEventListener("click", () => {
        setShowSelect(false);
      });
    };
  }, []);

  return (
    <div className={styes.custom_select} id="custom_select" onClick={(e)=> e.stopPropagation()}>
        {children}
    </div>
  )
}
