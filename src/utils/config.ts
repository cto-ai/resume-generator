import { ux } from "@cto.ai/sdk";
import { isSlack } from "./helpers";

const {
  colors: { bold, cyanBright, bgBlueBright }
} = ux;

const cto_terminal = `
  [94m██████[39m[33m╗[39m [94m████████[39m[33m╗[39m  [94m██████[39m[33m╗ [39m      [94m█████[39m[33m╗[39m  [94m██[39m[33m╗[39m
 [94m██[39m[33m╔════╝[39m [33m╚══[39m[94m██[39m[33m╔══╝[39m [94m██[39m[33m╔═══[39m[94m██[39m[33m╗[39m     [94m██[39m[33m╔══[39m[94m██[39m[33m╗[39m [94m██[39m[33m║[39m
 [94m██[39m[33m║     [39m [94m   ██[39m[33m║   [39m [94m██[39m[33m║[39m[94m   ██[39m[33m║[39m     [94m███████[39m[33m║[39m [94m██[39m[33m║[39m
 [94m██[39m[33m║     [39m [94m   ██[39m[33m║   [39m [94m██[39m[33m║[39m[94m   ██[39m[33m║[39m     [94m██[39m[33m╔══[39m[94m██[39m[33m║[39m [94m██[39m[33m║[39m
 [33m╚[39m[94m██████[39m[33m╗[39m [94m   ██[39m[33m║   [39m [33m╚[39m[94m██████[39m[33m╔╝[39m [94m██[39m[33m╗[39m [94m██[39m[33m║[39m[94m  ██[39m[33m║[39m [94m██[39m[33m║[39m
 [33m ╚═════╝[39m [33m   ╚═╝   [39m [33m ╚═════╝ [39m [33m╚═╝[39m [33m╚═╝  ╚═╝[39m [33m╚═╝[39m

 We’re building the world’s best developer experiences.`;

const cto_slack = `:white_square::white_square::white_square::white_square::white_square::white_square::white_square::white_square::white_square::white_square::white_square::white_square::white_square::white_square::white_square::white_square:
:white_square::white_square::black_square::black_square::white_square::white_square::black_square::black_square::black_square::white_square::white_square::white_square::black_square::black_square::black_square::white_square:
:white_square::black_square::white_square::white_square::black_square::white_square::black_square::white_square::white_square::black_square::white_square::black_square::white_square::white_square::white_square::white_square:
:white_square::black_square::white_square::white_square::black_square::white_square::black_square::black_square::black_square::white_square::white_square::white_square::black_square::black_square::white_square::white_square:
:white_square::black_square::white_square::white_square::black_square::white_square::black_square::white_square::white_square::white_square::white_square::white_square::white_square::white_square::black_square::white_square:
:white_square::white_square::black_square::black_square::white_square::white_square::black_square::white_square::white_square::white_square::white_square::black_square::black_square::black_square::white_square::white_square:
:white_square::white_square::white_square::white_square::white_square::white_square::white_square::white_square::white_square::white_square::white_square::white_square::white_square::white_square::white_square::white_square:`;

export const getLogo = () => {
  return isSlack() ? cto_slack : cto_terminal;
};

export const preRequisites = `\n${bold.underline(
  "ℹ️  Prerequisites:"
)}  🔑  ${bold("Github access token")}
Check out the readme for instructions on how to generate and set the token as a secret: ${cyanBright(
  "https://github.com/cto-ai/resume-generator"
)}\n`;

export const intro = `
\n👋  ${bgBlueBright("Welcome to the CTO.ai Resume Generator")} 👋
\nThis Op will allow you to create a deploy an online resume with ease!
\nIt will automatically connect to your Github account, create a public repository for you, scaffold an online resume website inside it, and automatically deploy it to Github Pages. To continue customizing your online resume, just edit, push, and your changes will be live!`;

export const generateInfoSiteTypes = (user: string) =>
  `\n💡  Your online resume can be deployed on Github Pages either as your user site ${cyanBright(
    `\`${user}.github.io\``
  )} or as a project site ${cyanBright(`\`${user}.github.io/resume\``)}.`;

export const projectDescription = `Online resume generated with The Ops Platform: https://github.com/cto-ai/resume-generator`;
export const templateSourceUrl = `https://github.com/cto-ai/gatsby-resume-template`;
export const initialCommitMessage = `Initial commit: Generated with the Ops Platform (CTO.ai)`;
export const workflowFilename = "deploy.yml";

export const bannerLink =
  "![official-banner-v3](https://user-images.githubusercontent.com/22829270/75378425-8053e600-5888-11ea-85c2-c4f6f90d6f72.png)";

export const githubTokenSecretName = "ACCESS_TOKEN";

export const successMessage = (url: string) =>
  `\n✅  Success, your online resume app has been created and deployed to Github. Check it out: ${cyanBright(
    url
  )}`;
