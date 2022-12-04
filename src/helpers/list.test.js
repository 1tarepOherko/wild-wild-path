import { testOutput } from './output.test.js'
import { testValidation } from './validate.test.js'

import { list, iterate } from 'wild-wild-path'

// Repeat the same tests for both `list()` and `iterate()`
export const testListOutput = function (inputs) {
  testOutput(listMethods, inputs)
}

export const testListValidation = function (inputs) {
  testValidation(listMethods, inputs)
}

const listMethods = [
  { name: 'list', method: list },
  {
    name: 'iterate',
    method(...inputs) {
      return [...iterate(...inputs)]
    },
  },
]
