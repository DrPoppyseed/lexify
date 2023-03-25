import * as React from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../primitives/Button";

export const PreAuthHeader: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex justify-between">
      <Button
        onClick={(e) => {
          e.preventDefault();
          navigate("/");
        }}
      >
        <p>
          <b>Lexify</b>
        </p>
      </Button>
      {children}
    </div>
  );
};
