import {describe, expect, test, beforeEach, jest} from '@jest/globals'
import {InputOptions} from '@actions/core'

// Import the necessary dependencies
const core = require('@actions/core') // Replace with the actual core module

// Import the run function
const {run} = require('../src/main')

// Mock the core module functions
jest.mock('@actions/core', () => ({
  getInput: jest.fn(),
  setOutput: jest.fn(),
  setFailed: jest.fn()
}))

describe('run', () => {
  beforeEach(() => {
    // Clear the mock function calls before each test
    jest.clearAllMocks()
  })

  it('should parse the input matrix and filter correctly', () => {
    // Arrange
    const inputMatrix = {key1: 'value1', key2: 'value2', key3: 'value3'}
    const filter = ['key1', 'key2']
    core.getInput.mockImplementation(
      (name: string, {required}: InputOptions) => {
        if (name === 'matrix' && required) {
          return JSON.stringify(inputMatrix)
        } else if (name === 'filter' && required) {
          return JSON.stringify(filter)
        }
      }
    )
    const logSpy = jest.spyOn(console, 'log')

    // Act
    run()

    // Assert
    expect(core.getInput).toHaveBeenCalledWith('matrix', {required: true})
    expect(core.getInput).toHaveBeenCalledWith('filter', {required: true})
    expect(core.setOutput).toHaveBeenCalledWith('matrix', {
      config: ['value1', 'value2']
    })
    expect(logSpy).toHaveBeenCalledWith(
      `filtered matrix:\n${JSON.stringify({config: ['value1', 'value2']})}`
    )
    expect(core.setFailed).not.toHaveBeenCalled()
  })

  it('should handle parsing errors and set the failure message', () => {
    // Arrange
    core.getInput.mockImplementation(() => {
      throw new Error('Invalid input')
    })

    // Act
    run()

    // Assert
    expect(core.getInput).toHaveBeenCalledWith('matrix', {required: true})
    expect(core.getInput).not.toHaveBeenCalledWith('filter', {required: true})
    expect(core.setOutput).not.toHaveBeenCalled()
    expect(console.log).not.toHaveBeenCalled()
    expect(core.setFailed).toHaveBeenCalledWith('Invalid input')
  })
})
