import { useState } from "react";
import { CiLock } from "react-icons/ci";
import { IoEye, IoEyeOutline } from "react-icons/io5";

export default function PasswordInput({
    onChange=()=> {},
    name="password",
    value="",
    placeholder="Password"
}) {

    const [togglePassword, setTogglePassword] = useState(false);
  return (
    <>
      <CiLock />
      <input
        type={togglePassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <span onClick={() => setTogglePassword((prev) => !prev)}>
        {togglePassword ? <IoEye /> : <IoEyeOutline />}
      </span>
    </>
  );
}
