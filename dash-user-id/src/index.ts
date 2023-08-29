import {
  Clipboard,
  environment,
  LaunchType,
  Toast,
  updateCommandMetadata,
  getPreferenceValues
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
    const toast = new Toast({
      style: Toast.Style.Success,
      title: 'Copied to clipboard',
      message: userId
    })
    await toast.show()
  }
}

export default command
