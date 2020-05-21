import { sdk, ux } from "@cto.ai/sdk";

import { track } from "./analytics";
import { initialCommitMessage } from "./config";
import { customizeApp } from "./helpers";
import { pExec } from "./pExec";
import { AppConfig, GlobalGitConfig } from "../types";

const configGitLocally = async ({
  projectName,
  githubUserName,
  userEmail
}: GlobalGitConfig) => {
  await track({
    event: `Configuring git on new project`
  });

  try {
    await pExec(`cd ${projectName} && git init`);
  } catch (error) {
    await track({
      event: `Error initializing git`,
      error: JSON.stringify(error)
    });
    throw error;
  }

  try {
    await pExec(
      `cd ${projectName} && git config --local user.name "${githubUserName}" \
        && git config --local user.email "${userEmail}" \
        && git config --local commit.gpgsign false`
    );
  } catch (error) {
    await track({
      event: `Error configuring git inside container`,
      error: JSON.stringify(error)
    });
    throw error;
  }

  await track({
    event: `Git configuration completed`
  });
};

const addAndCommitFiles = async (projectName: string) => {
  try {
    await pExec(
      `cd ${projectName} && git add . && git commit -m '${initialCommitMessage}'`
    );
  } catch (error) {
    await track({
      event: `Error adding and commiting app files`,
      error: JSON.stringify(error)
    });
    throw error;
  }
};

const configureRemote = async (
  projectName: string,
  repoFullName: string,
  token: string
) => {
  const urlWithToken = `https://${token}@github.com/${repoFullName}.git`;
  try {
    await pExec(`cd ${projectName} && git remote add origin ${urlWithToken}`);
  } catch (error) {
    await track({
      event: `Error adding remote connection`,
      error: JSON.stringify(error)
    });
    throw error;
  }
};

const pushToRemote = async (
  projectName: string,
  repoFullName: string,
  repoUrl: string,
  isUserSite: boolean
) => {
  // Deploying a user site is only done from master, so we push to develop
  const gitCommand = isUserSite
    ? "git checkout -b develop && git push -u origin develop"
    : "git push -u origin master";
  try {
    await pExec(`cd ${projectName} && ${gitCommand}`);
  } catch (error) {
    await track({
      event: `Error pushing to remote`,
      error: JSON.stringify(error)
    });
    throw error;
  }
};

export const initializeAndPushRepo = async ({
  projectName,
  repoFullName,
  userFullName,
  githubUserName,
  userEmail,
  repoUrl,
  token,
  isUserSite,
  socialMedia
}: AppConfig) => {
  await track({
    event: `Initialize Git remote connection`
  });

  await configGitLocally({ projectName, githubUserName, userEmail });
  await customizeApp(
    projectName,
    userFullName,
    userEmail,
    githubUserName,
    isUserSite,
    socialMedia
  );
  await addAndCommitFiles(projectName);
  await configureRemote(projectName, repoFullName, token);
  await pushToRemote(projectName, repoFullName, repoUrl, isUserSite);

  await track({
    event: `Repository successfully configured and pushed to Github`
  });
};
