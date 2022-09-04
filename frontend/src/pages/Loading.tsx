import { LinearProgress, styled, Typography } from "@mui/material";

const Loading = () => (
  <div>
    <LinearProgress />
    <TextContainer>
      <Typography variant="h6">Preparing your vocab words...</Typography>
    </TextContainer>
  </div>
);

const TextContainer = styled("div")`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

export default Loading;
