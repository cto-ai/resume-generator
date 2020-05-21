import { Question } from "@cto.ai/sdk";

export const getSiteType = (user: string): Question<{ siteType: string }> => {
  return {
    type: "autocomplete",
    name: "siteType",
    message: "How would you like your online resume to be deployed?",
    choices: [`${user}.github.io`, `${user}.github.io/resume`]
  };
};

export const getSocialMediaHandles: Question[] = [
  {
    type: "input",
    name: "twitter",
    message: "What's your Twitter handle?",
    default: "janedoe"
  },
  {
    type: "input",
    name: "linkedin",
    message: "What's your Linkedin handle?",
    default: "janedoe"
  }
];
