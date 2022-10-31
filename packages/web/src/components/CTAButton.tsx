import { useNavigate } from "react-router-dom";
import { ButtonBase, styled, Typography } from "@mui/material";

const CTAButton = () => {
  const navigate = useNavigate();
  return (
    <FlatButton
      onClick={(e) => {
        e.preventDefault();
        navigate("/login");
      }}
    >
      <Typography color="#fff">
        <b>Try Lexify free</b>
      </Typography>
    </FlatButton>
  );
};

const FlatButton = styled(ButtonBase)`
  padding: ${({ theme }) => `${theme.spacing(0.5)} ${theme.spacing(1)}`};
  width: max-content;
  border-radius: 3px;
  border: 1px solid rgba(15, 15, 15, 0.15);
  background-color: #3ec70b;
  color: #fff;
`;

export default CTAButton;
