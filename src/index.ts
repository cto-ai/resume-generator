// Step 2: import the `ux` and `sdk` modules from the @cto.ai/sdk package
import { ux, sdk } from "@cto.ai/sdk";

import createApplication from "./controllers";

import { track } from "./utils/analytics";
import {
  getLogo,
  generateInfoSiteTypes,
  intro,
  preRequisites,
} from "./utils/config";
import {
  createRepository,
  getGithubClient,
  getUserGithubInfo,
  configureTokenAsSecret,
  buildAndDeploy,
} from "./utils/github";
import { getSiteType, getSocialMediaHandles } from "./prompts";

import { RepoConfig, SocialMedia } from "./types";

export const main = async () => {
  await ux.print(getLogo());
  await ux.print(intro);
  await ux.print(preRequisites);
  await track({
    event: "Op initialized",
  });

  // Retrieve Github token
  // Step 4: retrieve the token saved as secret under the key `GITHUB_ACCESS_TOKEN` using `sdk.getSecret`
  const { GITHUB_ACCESS_TOKEN } = await sdk.getSecret("GITHUB_ACCESS_TOKEN");
  await track({
    event: "Github access token retrieved",
  });

  try {
    // Authenticate with Github
    const github = await getGithubClient(GITHUB_ACCESS_TOKEN);
    const { userFullName, userEmail, githubUserName } = await getUserGithubInfo(
      github
    );

    // Prompt user to select site type (user or project)
    const infoSiteTypes = generateInfoSiteTypes(githubUserName);
    // Step 3: print out the generated info message using `ux.print`
    await ux.print(infoSiteTypes);

    const { siteType } = await ux.prompt(getSiteType(githubUserName));

    // Prompt user for Twitter and Linkedin handles
    // Step 3: pass the array of Question objects to prompt for social media handles to `ux.prompt`
    const socialMedia: SocialMedia = await ux.prompt(getSocialMediaHandles);

    const isUserSite = !siteType.includes('resume');
    let projectName = `resume`;
    let appUrl = `https://${githubUserName}.github.io/resume`;
    if (isUserSite) {
      projectName = `${githubUserName}.github.io`;
      appUrl = `https://${projectName}`;
    }

    // Create repository
    const repoConfiguration: RepoConfig = {
      github,
      projectName,
    };
    const newRepo = await createRepository(repoConfiguration);
    await configureTokenAsSecret(
      github,
      githubUserName,
      projectName,
      GITHUB_ACCESS_TOKEN
    );

    // Generate customized app & push to repository
    await createApplication({
      projectName,
      userFullName: userFullName || "Jane Doe",
      userEmail: userEmail || "jane.doe@email.com",
      githubUserName,
      repoFullName: newRepo.full_name,
      repoUrl: newRepo.html_url,
      token: GITHUB_ACCESS_TOKEN,
      isUserSite,
      socialMedia
    });

    // Wait for automated build & deploy
    await buildAndDeploy({
      github,
      githubUserName,
      projectName,
      appUrl,
    });

    // Step 6: call the utility method `track` to record the successful completion of the Op
    // make sure you also record the `githubUserName` and `projectName` the Op was used with
    // TODO: add your code on the lines below
    
  } catch (error) {
    // Step 5: log the error to the console using `sdk.log`
    sdk.log(error);

    // Step 6: call the utility method `track` to record the successful completion of the Op
    // make sure you also record the stringified error object `JSON.stringify(error)`
    // TODO: add your code on the lines below
   
    process.exit(1);
  }
};

main();
