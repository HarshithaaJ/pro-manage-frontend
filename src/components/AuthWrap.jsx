import styles from "./css/AuthWrap.module.scss";
import Astronaut from "../assets/images/astronaut.png"
import AstroBack from "../assets/images/astro-back.png"

export default function AuthWrap({children}) {
  return (
    <div className={styles.auth_wrap}>
        <main>
            <div>
                <div>
                    <img src={Astronaut} alt="astronaut" />
                    <img src={AstroBack} alt="back" />
                </div>
                <div>
                    <h3>Welcome aboard my friend</h3>
                    <p>just a couple of clicks and we start</p>
                </div>
            </div>
        </main>
        {children}
    </div>
  )
}