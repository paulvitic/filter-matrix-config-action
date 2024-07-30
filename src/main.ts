import * as core from '@actions/core'

export function run(): void {
  try {
    const inputMatrix: object = JSON.parse(
      core.getInput('matrix', {required: true})
    )
    const filterInput = core.getInput('filter', {required: false})
    const filter: string[] = filterInput ? JSON.parse(filterInput) : []
    const config: object[] = []
    if (!filter) {
      console.log(`no filter provided, returning empty matrix`)
    } else {
      for (const [key, value] of Object.entries(inputMatrix)) {
        if (filter.includes(key)) {
          config.push(value)
        }
      }
    }
    core.setOutput('matrix', {config})
    console.log(`filtered matrix:\n${JSON.stringify({config})}`)
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

run()
