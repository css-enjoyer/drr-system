import React from "react";
import { PropagateLoader } from "react-spinners";

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
      <PropagateLoader color={"#36D7B7"} loading={true} />
    </div>
  );
};

export default Loading;
