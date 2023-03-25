import CTAButton from "../components/CTAButton";
import { PreAuthHeader } from "../components/PreAuthHeader";

const Landing = () => (
  <div className="grid h-full w-full">
    <PreAuthHeader>
      <CTAButton />
    </PreAuthHeader>

    <div className="absolute left-1/2 top-1/2 translate-x-1/2 translate-y-1/2 flex flex-col">
      <h3 className="mb-2">
        <b>Want a digital vocabulary book?</b>
        <br /> We can help.
      </h3>
      <h6 className="mb-2">Lexify is a dead simple vocabulary card builder.</h6>
      <CTAButton />
    </div>
  </div>
);

export default Landing;
