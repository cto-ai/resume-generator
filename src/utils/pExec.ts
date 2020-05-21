import { ux, sdk } from "@cto.ai/sdk";

const {
  reset: { bold, magenta }
} = ux.colors;

export const pExec = sdk.exec;

export const pExecWithLogs = async (command: string) => {
  await ux.print(bold(`Running \`${magenta(command)}\``));

  // Step 5: execute the `command` by passing it to `sdk.exec`
  const { stdout, stderr } = (await sdk.exec(command)) as {
    stdout: string;
    stderr: string;
  };
  if (stdout) await ux.print(`${stdout}`);
  if (stderr) await ux.print(`${stderr}`);

  return { stdout, stderr };
};
