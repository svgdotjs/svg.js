import Base from '../../../src/types/Base.js'

const { any } = jasmine

describe('Base.js', () => {
  it('holds the base class', () => {
    expect(new Base).toEqual(any(Base))
  })
})
