import { Octokit } from "@octokit/rest";
import sodium from "tweetsodium";
import { ux } from "@cto.ai/sdk";

import { track } from "./analytics";
import {
  githubTokenSecretName,
  initialCommitMessage,
  projectDescription,
  workflowFilename
} from "./config";
import { poll } from "./helpers";
import { RepoConfig, UserInfo, WorkflowStatusCheckConfig } from "../types";

const {
  colors: { cyanBright }
} = ux;

export const getGithubClient = async (token: string) => {
  const octokit = new Octokit({
    auth: token
  });
  return octokit;
};

export const getUserGithubInfo = async (gitHub): Promise<UserInfo> => {
  await track({
    event: "Authenticating user on Github"
  });
  await ux.spinner.start(`⏳  Establishing connection to Github...`);

  try {
    const {
      data: { name, email, login }
    } = await gitHub.request("/user");
    await ux.spinner.stop(`✅  Connection has been established!`);

    await track({
      event: "Github authentication successful",
      githubUserName: login
    });

    return {
      userFullName: name,
      userEmail: email,
      githubUserName: login
    };
  } catch (error) {
    await ux.spinner.stop(`🛑  Failed to connect to Github!`);
    await track({
      event: `Error authenticating user on Github`,
      error: JSON.stringify(error)
    });
    throw error;
  }
};

export const createRepository = async ({ github, projectName }: RepoConfig) => {
  await track({
    event: `Creating github repository`,
    projectName
  });
  await ux.spinner.start(`🔧  Creating a new repository, please wait...`);

  try {
    const options = {
      name: projectName,
      description: projectDescription,
      private: false
    };
    const newRepo = await github.repos.createForAuthenticatedUser(options);
    await track({
      event: `Repository successfully created`,
      projectName
    });
    await ux.spinner.stop(
      `✅  Repository \`${projectName}\` successfully created!`
    );
    return newRepo.data;
  } catch (error) {
    await track({
      event: `Error creating repository`,
      error: JSON.stringify(error),
      projectName
    });
    await ux.spinner.stop(`🛑  Failed to create repository!`);
    throw error;
  }
};

export const configureTokenAsSecret = async (
  github,
  githubUserName,
  projectName,
  token
) => {
  await track({
    event: `Configuring token as a secret`,
    githubUserName,
    projectName
  });
  try {
    const {
      data: { key_id: publicKeyId, key: publicKey }
    } = await github.actions.getPublicKey({
      owner: githubUserName,
      repo: projectName
    });

    const encryptedBytes = sodium.seal(
      Buffer.from(token),
      Buffer.from(publicKey, "base64")
    );
    const encryptedSecretValue = Buffer.from(encryptedBytes).toString("base64");

    await github.actions.createOrUpdateSecretForRepo({
      owner: githubUserName,
      repo: projectName,
      name: githubTokenSecretName,
      encrypted_value: encryptedSecretValue,
      key_id: publicKeyId
    });

    await track({
      event: `Successfully set up token as repo secret`,
      githubUserName,
      projectName
    });
  } catch (error) {
    await track({
      event: `Error setting up token as repo secret`,
      error: JSON.stringify(error),
      githubUserName,
      projectName
    });
    throw error;
  }
};

const waitForWorkflowDetection = async ({
  github,
  githubUserName,
  projectName,
  appUrl
}: WorkflowStatusCheckConfig) => {
  try {
    await track({
      event: `Start polling Github Actions workflow detection`,
      githubUserName,
      projectName
    });

    let retry = true;
    while (retry) {
      const fnArgs = [
        "GET /repos/:owner/:repo/actions/workflows",
        {
          owner: githubUserName,
          repo: projectName,
          workflow_file_name: workflowFilename
        }
      ];
      const validateFn = ({ data: { total_count } }) => total_count > 0;
      await poll(github.request, fnArgs, validateFn, 5000, 15);
      retry = false;
    }
    await track({
      event: `Finished polling Github Actions workflow detection`,
      githubUserName,
      projectName
    });
  } catch (error) {
    await track({
      event: `Error polling Github Actions workflow detection`,
      error: JSON.stringify(error)
    });
    throw error;
  }
};

const waitForWorklowCompleted = async ({
  github,
  githubUserName,
  projectName,
  appUrl,
  repoUrl
}: WorkflowStatusCheckConfig) => {
  try {
    await track({
      event: `Start polling Github Actions workflow status`,
      githubUserName,
      projectName
    });

    let retry = true;
    while (retry) {
      const fnArgs = [
        "GET /repos/:owner/:repo/actions/workflows/:workflow_file_name/runs",
        {
          owner: githubUserName,
          repo: projectName,
          workflow_file_name: workflowFilename
        }
      ];
      const validateFn = ({ data: { workflow_runs } }) => {
        const associatedWorkflow = workflow_runs.find(
          (run) => run.head_commit.message === initialCommitMessage
        );
        return associatedWorkflow && associatedWorkflow.status === "completed";
      };
      await poll(github.request, fnArgs, validateFn, 2000, 100);
      retry = false;
    }
    await track({
      event: `Finished polling Github Actions workflow status`,
      githubUserName,
      projectName
    });
  } catch (error) {
    await track({
      event: `Error polling Github Actions workflow status`,
      error: JSON.stringify(error)
    });
    throw error;
  }
};

export const buildAndDeploy = async ({
  github,
  githubUserName,
  projectName,
  appUrl,
  repoUrl
}: WorkflowStatusCheckConfig) => {
  await ux.spinner.start(
    "🏗  Building and deploying your new online resume. Please wait..."
  );

  try {
    // Check if Github Actions detected workflow configuration
    await waitForWorkflowDetection({
      github,
      githubUserName,
      projectName,
      appUrl,
      repoUrl
    });

    // Wait until workflow has completed
    await waitForWorklowCompleted({
      github,
      githubUserName,
      projectName,
      appUrl,
      repoUrl
    });

    await ux.spinner.stop(
      `✅  Successfully built and deployed your new online resume!`
    );
    await ux.print(`Access your online resume here: ${cyanBright(appUrl)}`);
    await ux.print(
      `To continue customizing the content, clone, edit and push your changes to the main branch!`
    );
  } catch (error) {
    await ux.spinner.stop(
      "🛑  Failed to build and deploy application to Github Pages!"
    );
    await ux.print(
      `Failed to wait for Github Actions workflow to complete. Please check ${cyanBright(
        `${repoUrl}/actions`
      )}.\nIf the workflow is not detected, try pushing a new commit in the main branch.`
    );
    throw error;
  }
};
