import { sdk } from "@cto.ai/sdk";

export const track = async (trackingData) => {
  const metadata = {
    op: `Resume Generator`,
    ...trackingData
  };
  const trackingTags = ["track", "cto.ai-official-op", "resume-generator"];

  // Step 6: track events and associated metadata using `sdk.track`
  // TODO: add your code on this line
};
