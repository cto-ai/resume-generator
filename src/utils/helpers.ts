import { sdk } from "@cto.ai/sdk";
import fs from "fs";

import { track } from "./analytics";
import { bannerLink, workflowFilename } from "./config";
import { SocialMedia } from "../types";
import { pExec } from "../utils/pExec";

const insertBanner = async (projectName: string) => {
  await track({
    event: `Adding CTO.ai banner to README`
  });

  try {
    const folderStr: any = await pExec(`cd ${projectName} && ls`);
    if (folderStr.stdout.includes("README.md")) {
      await pExec(
        `cd ${projectName} && echo "$(echo -n "${bannerLink}\n" | cat - README.md)" > README.md`
      );
    } else {
      await pExec(
        `cd ${projectName} && touch README.md && echo "${bannerLink}" >> README.md`
      );
    }
  } catch (error) {
    await track({
      event: `Error inserting banner in README`,
      error: JSON.stringify(error)
    });
    throw `Error inserting banner in README`;
  }
};

const customizeConfigFile = async (
  projectName: string,
  userFullName: string,
  userEmail: string,
  githubUserName: string,
  isUserSite: boolean,
  socialMedia: SocialMedia
) => {
  const pathPrefix = isUserSite ? "" : projectName;
  const configFilePath = `/ops/${projectName}/config.js`;
  const [firstName, lastName] = userFullName.split(" ");
  const { twitter, linkedin } = socialMedia;

  const configFileContents = fs.readFileSync(configFilePath, "utf8");
  const updatedConfigFileContents = configFileContents
    .replace(/REPOSITORY = '.*'/g, `REPOSITORY = '${pathPrefix}'`)
    .replace(/FIRST_NAME = '.*'/g, `FIRST_NAME = '${firstName}'`)
    .replace(/LAST_NAME = '.*'/g, `LAST_NAME = '${lastName}'`)
    .replace(/EMAIL = '.*'/g, `EMAIL = '${userEmail}'`)
    .replace(
      /GITHUB_USERNAME = '.*'/g,
      `GITHUB_USERNAME = '${githubUserName}'`
    )
    .replace(/TWITTER_USERNAME = '.*'/g, `TWITTER_USERNAME = '${twitter}'`)
    .replace(
      /LINKEDIN_USERNAME = '.*'/g,
      `LINKEDIN_USERNAME = '${linkedin}'`
    );
  fs.writeFileSync(configFilePath, updatedConfigFileContents);
}

const customizeWorkflowFile = async (
  projectName: string,
  isUserSite: boolean
) => {
  // Deploying a user site is only done from master
  if (isUserSite) {
    const workflowPath = `/ops/${projectName}/.github/workflows/${workflowFilename}`;
    const workflowFileContents = fs.readFileSync(workflowPath, "utf8");
    const updatedWorkflowFileContents = workflowFileContents
      .replace(/master\n/g, `develop\n`)
      .replace(/BRANCH: gh-pages/g, `BRANCH: master`);
    fs.writeFileSync(workflowPath, updatedWorkflowFileContents);
  }
}

export const customizeApp = async (
  projectName: string,
  userFullName: string,
  userEmail: string,
  githubUserName: string,
  isUserSite: boolean,
  socialMedia: SocialMedia
) => {
  try {
    await insertBanner(projectName);
    await customizeConfigFile(
      projectName,
      userFullName,
      userEmail,
      githubUserName,
      isUserSite,
      socialMedia
    );
    await customizeWorkflowFile(projectName, isUserSite);
    await track({
      event: `Successfully customized app`
    });
  } catch (error) {
    await track({
      event: `Error customizing app`,
      error: JSON.stringify(error)
    });
    throw `Error customizing app`;
  }
};

export const isSlack = () => {
  return sdk.getInterfaceType() === "slack";
};

export const poll = async (
  fn,
  fnArgs,
  validate,
  interval = 5000,
  maxAttempts = 100
) => {
  let attempts = 0;

  const executePoll = async (resolve, reject) => {
    try {
      const result = await fn(...fnArgs);
      attempts++;
      if (validate(result)) {
        return resolve(result);
      } else if (maxAttempts && attempts === maxAttempts) {
        return reject(new Error(`Exceeded max attempts ${maxAttempts}`));
      } else {
        setTimeout(executePoll, interval, resolve, reject);
      }
    } catch (error) {
      return reject(error);
    }
  };

  return new Promise(executePoll);
};