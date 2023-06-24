import * as core from '@actions/core'

function run(): void {
  try {
    const inputMatrix: object = JSON.parse(
      core.getInput('matrix', {required: true})
    )
    const filter: string[] = JSON.parse(
      core.getInput('filter', {required: true})
    )
    const config: object[] = []
    for (const [key, value] of Object.entries(inputMatrix)) {
      if (filter.includes(key)) {
        config.push(value)
      }
    }
    core.setOutput('matrix', {config})
    console.log(`filtered matrix:\n${JSON.stringify({config})}`)
  } catch (error:any) {
    core.setFailed(error.message)
  }
}

run()
