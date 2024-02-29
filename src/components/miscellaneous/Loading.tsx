import React from "react";
import { BarLoader } from "react-spinners";

const Loading = () => {
  const containerStyle: React.CSSProperties = {
    // Explicitly specify type as React.CSSProperties
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  };

  return (
    <div style={containerStyle}>
      <BarLoader color={"#736060"} loading={true} />
    </div>
  );
};

export default Loading;
