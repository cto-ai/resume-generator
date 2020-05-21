import { Question } from "@cto.ai/sdk";

export const getSiteType = (user: string): Question<{ siteType: string }> => {
  return {
    type: "autocomplete",
    name: "siteType",
    message: "How would you like your online resume to be deployed?",
    choices: [`${user}.github.io`, `${user}.github.io/resume`]
  };
};

// Step 3: export an array of Question objects to prompt for social media handles
// the prompts should have the following names: `twitter`, `linkedin`
// TODO: add your code on this line and below
export const getSocialMediaHandles: Question[] = 
