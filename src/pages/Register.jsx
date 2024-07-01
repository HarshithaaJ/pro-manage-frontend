import styles from "./css/Auth.module.scss";
import {CiMail} from "react-icons/ci";
import PasswordInput from "../components/form-inputs/PasswordInput";
import Button from "../components/form-inputs/Button";
import { useState } from "react";
import { registerUser } from "../apis/auth.js";
import AuthWrap from "../components/AuthWrap.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/user.context.js";
import { IoPersonOutline } from "react-icons/io5";

function Register() {
    const navigate = useNavigate();
    const {login} = useAuth();
    const [user, setUser] = useState({
        name: "",
        email: "",
        confirmPassword: "",
        password: ""
    });

    const [error, setError] = useState({
        name: "",
        email: "",
        confirmPassword: "",
        password: "",
        register: ""
    });
    const [processing, setProcessing] = useState(false);

    const handleInputChange = (e)=> {
        const {name, value} = e.target;
        setUser((prev)=> ({...prev, [name]: value}))

        error[name] && setError((prev)=> ({...prev, [name]: ""}));
        error["register"] && setError((prev)=> ({...prev, register: ""}));
    }

    const handleErrors = ()=> {
        const registerError = {};
        
        for(const field in user) {
            if(user[field].trim()==="") registerError[field] = `This field is required`;
            else if(field==="email" && !(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(user.email))) registerError.email="Invalid email address"
            else if(field==="password" && user.password.length < 8) registerError.password="Password of minimum 8 characters required";
        }

        if(user.password !== user.confirmPassword) registerError.confirmPassword="Password does not match"
  
        return Object.keys(registerError).length ? registerError : null;
    }

    const handleRegister = async (e)=> {
        e.preventDefault();
        setProcessing(true);

        const registerError = handleErrors();

        if(registerError) {
            setError((prev)=> ({...prev, ...registerError}));
            setProcessing(false);
            return;
        }

        const {data: newUser, error} = await registerUser({...user});
        if(error) {
            setError((prev)=> ({...prev, register: error}));
            setProcessing(false);
            return;
        }
        
        login({...newUser})
        localStorage.setItem("accessToken", newUser.accessToken);
        navigate('/dashboard');

    }

  return (
    <AuthWrap>
        <div className={styles.auth}>
        <main>
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
            <div>
                <div>
                    <div className={`${styles.form_input} ${error.name ? styles.red_border : ""}`}>
                    <IoPersonOutline />
                    <input
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={handleInputChange}
                        placeholder="Name"
                    />
                    </div>
                    <p className={styles.error}>{error.name}</p>
                </div>
                <div>
                    <div className={`${styles.form_input} ${error.email ? styles.red_border : ""}`}>
                    <CiMail />
                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                    />
                    </div>
                    <p className={styles.error}>{error.email}</p>
                </div>
            </div>
            <div>
                <div>
                    <div className={`${styles.form_input} ${error.password ? styles.red_border : ""}`}>
                    <PasswordInput
                        value={user.password}
                        onChange={handleInputChange}
                    />
                    </div>
                    <p className={styles.error}>{error.password}</p>
                </div>
                <div>
                    <div className={`${styles.form_input} ${error.confirmPassword ? styles.red_border : ""}`}>
                    <PasswordInput
                        value={user.confirmPassword}
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        onChange={handleInputChange}
                    />
                    </div>
                    <p className={styles.error}>{error.confirmPassword}</p>
                </div>
            </div>
            <p>{error.register}</p>
            <div>
                <Button type="submit" processing={processing}>Register</Button>
            </div>
            </form>
            <section>
            <p>Have an account ?</p>
            <Button onClick={()=> navigate("/login")}>Log in</Button>
            </section>
        </main>
        </div>
    </AuthWrap>
  );
}

export default Register