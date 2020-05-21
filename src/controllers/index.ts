import { ux, sdk } from "@cto.ai/sdk";

import { AppConfig } from "../types";

import { track } from "../utils/analytics";
import { templateSourceUrl } from "../utils/config";
import { initializeAndPushRepo } from "../utils/git";
import { pExec } from "../utils/pExec";

const {
  colors: { cyanBright }
} = ux;

const createApplication = async ({
  projectName,
  userFullName,
  userEmail,
  githubUserName,
  repoFullName,
  repoUrl,
  token,
  isUserSite,
  socialMedia
}: AppConfig) => {
  await track({
    event: `Generating application`,
    githubUserName,
    projectName
  });
  await ux.spinner.start(`🚧  Generating your online resume application..`);

  try {
    await pExec(
      `git clone ${templateSourceUrl} ${projectName} && cd ${projectName} && rm -rf .git`
    );
    await initializeAndPushRepo({
      projectName,
      userFullName,
      userEmail,
      githubUserName,
      repoFullName,
      repoUrl,
      token,
      isUserSite,
      socialMedia
    });
    await track({
      event: `Application generated`,
      githubUserName,
      projectName
    });
    await ux.spinner.stop(
      `✅  Application successfully generated: ${cyanBright(repoUrl)}`
    );
  } catch (error) {
    await track({
      event: `Error generating application`,
      error: JSON.stringify(error),
      githubUserName,
      projectName
    });
    await ux.spinner.stop(`🛑  Failed to generate application files!`);
    throw error;
  }
};

export default createApplication;
