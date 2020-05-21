![CTO Banner](https://cto.ai/static/oss-banner.png)

# Resume Generator 🚀 (Step 7)

This Op will Generate & deploy a resume website on Github Pages, using a CTO.ai customized [Gatsby template](https://github.com/cto-ai/gatsby-resume-template).

## Requirements

### Ops Platform

Running this op requires you to have access to the [Ops Platform](https://cto.ai/platform). Please review the [documentation](https://cto.ai/docs/overview) for detailed instructions on how to install the Ops CLI and/or Ops Slack application.

### Github Token

❗️ Before running the Op, please set the Github token as a secret, following the instructions below. In order for the Op to automatically retrieve this secret, please make sure you store it under the indicated key name. If the auto-match fails, the Op users will be prompted to select an option from the available list of secrets every time they run the Op.

`GITHUB_ACCESS_TOKEN`

In order to create a Github repository and update it with the content of the resume website, as well as deploy it on Github Pages, this Op requires an access token generated with the `repo` and `admin` scopes [here](https://github.com/settings/tokens/new), following the instructions available [here](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line).

Once created, save the token as a secret in your Ops team, by running this command:

```sh
ops secrets:set -k GITHUB_ACCESS_TOKEN -v <VALUE>
```

## Usage

### CLI

```sh
  ops run cto.ai/resume-generator # if running the public official Op
  ops run resume-generator # if you published or added the Op to your team
```

### Slack

```sh
  /ops run cto.ai/resume-generator # if running the public official Op
  /ops run resume-generator # if you published or added the Op to your team
```

## Features

This Op will allow you to create a deploy an online resume with ease! It will automatically connect to your Github account, create a public repository for you, scaffold an online resume website inside it, and automatically deploy it to Github Pages using a Github Actions workflow. To continue customizing your online resume, just edit, push, and your changes will be live! Or feel free to fork this repository and extend and customize the Op to your heart's desire!

There are two options for deploying the online resume, as per Github Pages:

### User site (`https://<your-github-username>.github.io`)

- The Op will attempt to create a repository named `<your-github-username>.github.io`; if that already exists, the Op will error out
- The source files for the application will be available in the `develop` branch of the named repository
- The built application files will be available and deployed from the `master` branch of the named repository

### Project site (`https://<your-github-username>.github.io/resume`)

- The Op will attempt to create a repository called `resume`; if that already exists, the Op will error out
- The source files for the application will be available in the `master` branch of the named repository
- The built application files will be available and deployed from the `gh-pages` branch of the named repository

## Troubleshooting

### Failed to authenticate with Github

The token you provided is probably incorrect. Go back to [Github - Personal access tokens](https://github.com/settings/tokens) and make sure you select the `repo` scope when generating a new token. Then follow the instructions above to update the secret value.

### Failed to create repository

You should be able to see more context in the error message printed out on your screen. Most likely, you already have a repository with that name (`<user>.github.io` if you selected the user site option, or `resume` if you selected the project site option). Please check your Github account, remove the repository and try running the Op again.

### Failed to build and deploy application to Github Pages

The application the Op generates and pushes into the repository requires building (more details in the section above). The build should be triggered automatically as soon as the Op pushes the code to the repository, with the help of [Github Actions](https://github.com/features/actions). Sometimes, Github Actions fails to detect the definition of the workflow inside the generated repository, or does it too late. The Op will be polling automatically to ensure the workflow is triggered, and then it will wait for it to complete. If this process doesn't happen or takes longer than expected, you might be getting the above mentioned error.

This is what you can do to make sure you get your application deployed in each scenario:
- Navigate to your newly created repository and click on *Actions* (e.g. `https://github.com/<user>/<repo>/actions`).
- If you see a workflow named `github pages` on the left side, under `All workflows`, it means Github Actions correctly detected the workflow, but was a bit delayed and the build didn't complete before the Op timed out on polling. As soon as you'll see the workflow complete for the initial commit in the repository, you should be able to access your online resume at the designated URL (see above).
- If you do not see any workflows, it means Github Actions has failed to detect the workflow configuration file. Try making a commit and push it to the main branch of your repository; in most cases, Github Actions should now detect the workflow and start running the build. Wait for completion, then access your online resume at the designated URL.

### Application successfully built and deploy, but getting 404 when visiting URL

If your workflow has successfully completed, then this is likely because Github Pages sometimes has a delay in reflecting the changes. The first time you generate your site, it could take about 10 minutes for it to show up, and possibly longer if it's a user site. If you are pushing subsequent updates, keep in mind that Github Pages are cached with CDN, so sometimes you might need a bit longer to see the changes reflected.

You can see the exact time of Github Pages deployments for your repository by accesing `https://github.com/<user>/<repo>/deployments`.

To ensure your latest version of the site looks as expected, you can get append the short commit hash to the URL, e.g. `https://<user>.github.io/<repo>?version=<xxxxxx>`.

### Application successfully built and deploy, but my site has a lot of placeholder content and I don't know how to update it

That's expected! This Op was designed to keep things simple and only update the very basic information about you (name, email address, social media links), leveraging information found in your Github profile, as well as a few prompts.

If you would like to fill in all the sections of your online resume, you just need to clone the repository the Op created for you, edit the `config.js` file with your content, and push to the main branch, hence automatically triggering the workflow and getting your updated site built and deployed.

Alternatively, you are welcome to fork this Op and consider extending it by adding additional [prompts](./src/prompts/index.ts), and extending the [`customizeApp` method](./src/utils/helpers.ts#L34). Then publish the Op to your team and run it anytime, or share it with your friends and colleagues! Refer back to the [Ops Platform Documentation](https://cto.ai/docs/overview) for help.

### Op failed for other/unknown reasons

If running the Op in the CLI, you should be able to get the error printed out, that should hopefully provide you with more context. If running the Op in Slack, try running it again with the `--debug` flag (`/ops run --debug cto.ai/resume-generator`) to get more context.

Reach out to our [Support](mailto:support@cto.ai) or join our [Community Slack](https://w.cto.ai/community) to get some help.

## Local Development

1. Clone the repo:

```sh
git clone https://github.com/cto-ai/resume-generator # or git@github.com:cto-ai/resume-generator.git
```

2. Navigate into the directory:

```sh
cd resume-generator
```

3. Run the Op from your current working directory with:

```sh
ops run . --build # or `ops run . -b`
```

4. Publish the Op to your active team with your desired changes:

```sh
ops publish .
```

## Contributing

See the [Contributing Docs](CONTRIBUTING.md) for more information.

## Contributors

<table>
  <tr>
    <td align="center"><a href="https://github.com/jmariomejiap"><img src="https://avatars3.githubusercontent.com/u/22829270?s=400&u=8b174cca1b78aaeea49f8db44fe7050d9d7e4227&v=4" width="100px;" alt=""/><br /><sub><b>Mario Mejia</b></sub></a><br/></td>
    <td align="center"><a href="https://github.com/ruxandrafed"><img src="https://avatars2.githubusercontent.com/u/11021586?s=100" width="100px;" alt=""/><br /><sub><b>Ruxandra Fediuc</b></sub></a><br/></td>
    <td align="center"><a href="https://github.com/CalHoll"><img src="https://avatars3.githubusercontent.com/u/21090765?s=400&v=4" width="100px;" alt=""/><br /><sub><b>Calvin Holloway</b></sub></a><br/></td>
  </tr>
</table>

## LICENSE

[MIT](LICENSE.txt)
