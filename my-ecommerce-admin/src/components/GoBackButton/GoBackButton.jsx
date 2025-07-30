import React from "react";
import { useNavigate } from "react-router-dom";

const GoBackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      style={{
        margin: "16px",
        padding: "8px 16px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      ← Go Back
    </button>
  );
};

export default GoBackButton;
