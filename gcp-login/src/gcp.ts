import { environment, LaunchType, Toast, updateCommandMetadata } from "@raycast/api";
import { exec } from "child_process";

const path = "~/google-cloud-sdk/bin/gcloud";

export default async function Command() {
  await updateCommandMetadata({ subtitle: "Open auth flow in browser" });
  exec(`${path} auth login --update-adc`, (error, stdout, stderr) => {
    if (error || stderr) {
      console.log(`error: ${error?.message}`);
      console.log(`error: ${stderr}`);
      return;
    }
  });
  if (environment.launchType === LaunchType.UserInitiated) {
    const toast = new Toast({
      style: Toast.Style.Success,
      title: "Done!",
      message: "Opening auth flow in browser",
    });
    toast.show();
  }
}
