import { handleMissingValue } from './path_missing.js'

// Expand special tokens like *, **, regexps, slices into property names or
// indices for a given value
export const expandTokens = function (entries, index, opts) {
  return entries
    .filter(({ pathArray }) => pathArray.length !== index)
    .flatMap((entry) => expandToken(entry, index, opts))
}

// Use the token to list entries against a target value.
const expandToken = function ({ pathArray, value }, index, opts) {
  const token = pathArray[index]
  const missingReturn = handleMissingValue(value, token, opts.classes)
  const childEntriesA = iterateToken(token, missingReturn, opts)
  return childEntriesA
    .filter(isAllowedProp)
    .map(({ value: childValue, missing: missingEntry }) => ({
      pathArray,
      value: childValue,
      missing: missingReturn.missing || missingEntry,
    }))
}

const isAllowedProp = function ({ prop }) {
  return !FORBIDDEN_PROPS.has(prop)
}

// Forbidden to avoid prototype pollution attacks
const FORBIDDEN_PROPS = new Set(['__proto__', 'prototype', 'constructor'])

const iterateToken = function (
  token,
  { missing: missingParent, value },
  { inherited, missing: includeMissing },
) {
  if (includeMissing) {
    return iterate(value, token, inherited)
  }

  if (missingParent) {
    return []
  }

  const childEntries = iterate(value, token, inherited)
  return childEntries.filter(isNotMissing)
}

const iterate = function (value, token) {
  return [{ value: value[token], prop: token, missing: !(token in value) }]
}

const isNotMissing = function ({ missing }) {
  return !missing
}
