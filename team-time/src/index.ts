import { Clipboard, environment, LaunchType, Toast, updateCommandMetadata } from "@raycast/api";

const command = async () => {
  const now = new Date();

  const dublin = now.toLocaleString(undefined, { timeZone: "Europe/Dublin", timeStyle: "short" });
  const athens = now.toLocaleString(undefined, { timeZone: "Europe/Athens", timeStyle: "short" });
  const europeCentral = now.toLocaleString(undefined, { timeZone: "Europe/Madrid", timeStyle: "short" });
  const dubai = now.toLocaleString(undefined, { timeZone: "Asia/Dubai", timeStyle: "short" });
  const newYork = now.toLocaleString(undefined, { timeZone: "America/New_York", timeStyle: "short" });
  const sanFrancisco = now.toLocaleString(undefined, { timeZone: "America/Los_Angeles", timeStyle: "short" });

  const subtitle = ` 🇺🇸 ${newYork}  🇺🇸 ${sanFrancisco}   🇮🇪 ${dublin}   🇭🇺 🇵🇱 🇪🇸 ${europeCentral}   🇬🇷 ${athens}   🇦🇪 ${dubai}`;
  await updateCommandMetadata({ subtitle });

  if (environment.launchType === LaunchType.UserInitiated) {
    const toast = new Toast({
      style: Toast.Style.Success,
      title: "Refreshed!",
      message: subtitle,
    });
    toast.primaryAction = {
      title: "Copy to Clipboard",
      shortcut: { modifiers: ["cmd", "shift"], key: "c" },
      onAction: () => Clipboard.copy(subtitle),
    };
    await toast.show();
  }
};

export default command;
