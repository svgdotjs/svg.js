/* globals describe, expect, it, jasmine */

import Base from '../../../src/types/Base.js'

const { any } = jasmine

describe('Base.js', () => {
  it('creates a new object of type Base', () => {
    expect(new Base()).toEqual(any(Base))
  })
})
