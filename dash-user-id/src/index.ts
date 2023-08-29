import {
  Clipboard,
  environment,
  LaunchType,
  updateCommandMetadata,
  getPreferenceValues,
  closeMainWindow,
  showHUD
} from '@raycast/api'

type Preferences = {
  userId: string
}

const preferences: Preferences = getPreferenceValues()

const command = async () => {
  const userId = preferences.userId
  await updateCommandMetadata({ subtitle: userId })

  await Clipboard.copy(userId)

  if (environment.launchType === LaunchType.UserInitiated) {
    closeMainWindow()
    showHUD(`Copied ${userId} to Clipboard`)
  }
}

export default command
