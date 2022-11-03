import { Grid, styled, Typography } from "@mui/material";
import PreAuthHeader from "../components/PreAuthHeader";
import CTAButton from "../components/CTAButton";

const Landing = () => (
  <LandingBase container>
    <PreAuthHeader>
      <CTAButton />
    </PreAuthHeader>

    <Title>
      <Typography variant="h3">
        <b>Want a digital vocabulary book?</b>
        <br /> We can help.
      </Typography>
      <Typography variant="h6">
        Lexify is a dead simple vocabulary card builder.
      </Typography>
      <CTAButton />
    </Title>
  </LandingBase>
);

const LandingBase = styled(Grid)`
  height: 100%;
  width: 100%;
`;

const Title = styled("div")`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;

  & > h3,
  & > h6 {
    margin-bottom: ${({ theme }) => theme.spacing(4)};
  }
`;

export default Landing;
