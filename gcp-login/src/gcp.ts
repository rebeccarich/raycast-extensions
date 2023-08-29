import { environment, getPreferenceValues, LaunchType, Toast, updateCommandMetadata } from '@raycast/api'
import { execa } from 'execa'

type Preferences = {
  pathToGcloud: string
}

const preferences: Preferences = getPreferenceValues()

export default async function Command() {
  await updateCommandMetadata({ subtitle: 'Open auth flow in browser' })
  try {
    execa(`${preferences.pathToGcloud} auth login --update-adc`, { shell: true })
  } catch (e) {
    console.log(e)
  }

  if (environment.launchType === LaunchType.UserInitiated) {
    const toast = new Toast({
      style: Toast.Style.Success,
      title: 'Done!',
      message: 'Opening auth flow in browser'
    })
    toast.show()
  }
}
