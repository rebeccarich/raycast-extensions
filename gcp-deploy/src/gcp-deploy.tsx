import { Action, ActionPanel, Color, Form, getPreferenceValues, Icon, showToast, Toast } from '@raycast/api'
import { readdirSync, statSync, copySync, rmSync } from 'fs-extra'
import { tmpdir, userInfo } from 'os'
import { join } from 'path'
import { simpleGit, SimpleGit } from 'simple-git'

type FormValues = {
  Repo: string
}

type Preferences = {
  repoPath: string
}

const preferences: Preferences = getPreferenceValues()

export default function Command(props: { draftValues?: FormValues }) {
  function isGitDirectory(path: string) {
    try {
      statSync(join(path, '.git'))
      return true
    } catch (err) {
      return false
    }
  }

  const gitDirectories = readdirSync(preferences.repoPath)
    .map((item) => join(preferences.repoPath, item))
    .filter((item) => statSync(item) && isGitDirectory(item))

  async function handleRepoChange(repo: string) {
    console.log(repo)

    // execa("which", ["gpg-agent"]).then((res) => {
    //   console.log(res);
    // });

    const temp = tmpdir()
    console.log(temp)
    console.log(userInfo())
    const baseDir = `${temp}/gcp-deploy-repo-tmp`
    console.log(baseDir)
    try {
      // rmSync(baseDir, { recursive: true })
      copySync(repo, baseDir, { filter: (s: string) => !s.includes('node_modules') })
      console.log('done!')
    } catch (err) {
      console.error(err)
      return
    }

    const git: SimpleGit = simpleGit({
      baseDir,
      spawnOptions: {
        uid: userInfo().uid,
        gid: userInfo().gid
      }
    })

    console.log(await git.listConfig())
    // console.log(await git.listRemote());
    await git.stash()
    await git.checkout('main')
    await git.fetch()
    console.log((await git.status()).isClean())
  }

  async function handleSubmit(values: FormValues) {
    console.log(values)
    // await showToast({ style: Toast.Style.Animated, title: "Reporting bug" });
    // try {
    //   const response = await fetch(`https://api.airtable.com/v0/${preferences.baseId}/Bugs%20and%20issues`, {
    //     method: "POST",
    //     headers: {
    //       Authorization: `Bearer ${preferences.apiKey}`,
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       records: [
    //         {
    //           fields: {
    //             ...values,
    //           },
    //         },
    //       ],
    //     }),
    //   });

    //   if (!response.ok) {
    //     throw Error(`${response.statusText} (HTTP ${response.status})`);
    //   }

    //   await showToast({ style: Toast.Style.Success, title: "Reported bug" });
    // } catch (error) {
    //   await showToast({
    //     style: Toast.Style.Failure,
    //     title: "Failed reporting bug",
    //     message: error instanceof Error ? error.message : String(error),
    //   });
    // }
  }

  return (
    <Form
      enableDrafts
      actions={
        <ActionPanel>
          <Action.SubmitForm icon={Icon.Bug} title="Create Deployment" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      {/* <Form.TextField id="Name" title="Name" placeholder="What went wrong?" defaultValue={props.draftValues?.Name} /> */}
      {/* <Form.TextArea
        id="Description"
        title="Description"
        placeholder="How can you reproduce the bug?"
        defaultValue={props.draftValues?.Description}
      /> */}
      <Form.Dropdown
        id="Repo"
        title="Choose a repo to deploy"
        defaultValue={props.draftValues?.Repo}
        storeValue
        onChange={handleRepoChange}
      >
        {gitDirectories.map((dir) => (
          <Form.Dropdown.Item
            icon={{ source: Icon.Folder, tintColor: Color.Magenta }}
            title={dir}
            value={dir}
            key={dir}
          />
        ))}
      </Form.Dropdown>
    </Form>
  )
}
