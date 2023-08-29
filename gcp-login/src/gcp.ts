import { environment, LaunchType, Toast, updateCommandMetadata } from '@raycast/api'
import { execa } from 'execa'

const path = '~/google-cloud-sdk/bin/gcloud'

export default async function Command() {
  await updateCommandMetadata({ subtitle: 'Open auth flow in browser' })
  console.log(process.execPath)
  const { stdout } = await execa(`which git`, { shell: true })
  console.log(stdout)
  try {
    // await execa(path, ['auth', 'login', '--brief', '--quiet'], { shell: true })
    const { stdout } = await execa(`${path} auth login --brief --quiet`, { shell: true })
    console.log(stdout)
  } catch (e) {
    console.log(e)
  }

  const { stdout: refreshToken } = await execa(path, ['auth', 'print-access-token'], { shell: true })

  try {
    await execa(path, ['auth', 'activate-refresh-token', refreshToken], { shell: true })
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
