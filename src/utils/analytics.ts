import { sdk } from "@cto.ai/sdk";

export const track = async (trackingData) => {
  const metadata = {
    op: `Resume Generator`,
    ...trackingData
  };
  const trackingTags = ["track", "cto.ai-official-op", "resume-generator"];

  await sdk.track(trackingTags, metadata);
};
