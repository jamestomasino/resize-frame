const { JSDOM } = require("jsdom");
const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);

const originalWindow = { ...window }
const windowSpy = jest.spyOn(global, 'window', 'get')
const { addResizeListener, removeResizeListener } = require('./index');
const waitRAF = () => new Promise(resolve => requestAnimationFrame(resolve))

describe('When addResizeListener adds a callback', () => {
  const mockCallback = jest.fn()
  addResizeListener(mockCallback)

  it('it should fire on resize', async () => {
    windowSpy.mockImplementation(() => ({
      ...originalWindow,
      pageYOffset: -40
    }))
    await waitRAF();
    expect(mockCallback).toHaveBeenCalled()
  })

  it('it shouldn\'t fire twice for a single resize', async () => {
    await waitRAF();
    expect(mockCallback).toHaveBeenCalledTimes(1)
  })

  it('it should fire on subsequent resize', async () => {
    windowSpy.mockImplementation(() => ({
      ...originalWindow,
      pageYOffset: 0
    }))
    await waitRAF();
    expect(mockCallback).toHaveBeenCalledTimes(2)
  })
})

describe('When removeResizeListener removes a callback', () => {
  const mockCallback = jest.fn()
  addResizeListener(mockCallback)
  removeResizeListener(mockCallback)

  it('it shouldn\'t fire on resize', async () => {
    windowSpy.mockImplementation(() => ({
      ...originalWindow,
      pageYOffset: -40
    }))
    await waitRAF();
    expect(mockCallback).toHaveBeenCalledTimes(0)
  })
})
