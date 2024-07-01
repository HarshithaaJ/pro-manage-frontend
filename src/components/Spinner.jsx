import {Triangle} from "react-loader-spinner";

export default function Spinner() {
  return (
    <div style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
      <Triangle
        visible={true}
        height="80"
        width="80"
        color="#17A2B8"
        ariaLabel="triangle-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
}
