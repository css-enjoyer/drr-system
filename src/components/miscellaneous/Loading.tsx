import React from "react";
import { BarLoader } from "react-spinners";
import { useThemeContext } from "../../theme/ThemeContextProvider";

const Loading = () => {
  const { mode } = useThemeContext();

  const containerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: mode === "light" ? "white" : "black",
  };


  return (
    <div style={containerStyle}>
      <BarLoader color={"#F2AF29"} loading={true} />
    </div>
  );
};

export default Loading;