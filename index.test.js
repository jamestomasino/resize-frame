const { JSDOM } = require("jsdom");
const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);

const originalDocument = { ...document.documentElement }
const docSpy = jest.spyOn(document, 'documentElement', 'get')
const { addResizeListener, removeResizeListener } = require('./index');
const waitRAF = () => new Promise(resolve => requestAnimationFrame(resolve))

describe('When addResizeListener adds a callback for content resize', () => {
  const mockCallback = jest.fn()

  beforeAll(() => {
    addResizeListener(mockCallback)
  })

  it('it should fire on content resize', async () => {
    docSpy.mockImplementation(() => ({
      ...originalDocument,
      scrollWidth: 1000
    }))
    await waitRAF();
    expect(mockCallback).toHaveBeenCalled()
  })

  it('it shouldn\'t fire twice for a single content resize', async () => {
    await waitRAF();
    expect(mockCallback).toHaveBeenCalledTimes(1)
  })

  it('it should fire on subsequent content resize', async () => {
    docSpy.mockImplementation(() => ({
      ...originalDocument,
      scrollWidth: 500
    }))
    await waitRAF();
    expect(mockCallback).toHaveBeenCalledTimes(2)
  })

  it('it should fire on different dimension content resize', async () => {
    docSpy.mockImplementation(() => ({
      ...originalDocument,
      scrollHeight: 1000
    }))
    await waitRAF();
    expect(mockCallback).toHaveBeenCalledTimes(3)
  })

  afterAll(() => {
    removeResizeListener(mockCallback)
    jest.clearAllMocks();
  })
})

describe('When addResizeListener adds a callback for client resize', () => {
  const mockCallback = jest.fn()

  beforeAll(() => {
    addResizeListener(mockCallback)
  })

  it('it should fire on screen resize', async () => {
    docSpy.mockImplementation(() => ({
      ...originalDocument,
      clientWidth: 1000
    }))
    await waitRAF();
    expect(mockCallback).toHaveBeenCalled()
  })

  it('it shouldn\'t fire twice for a single screen resize', async () => {
    await waitRAF();
    expect(mockCallback).toHaveBeenCalledTimes(1)
  })

  it('it should fire on subsequent screen resize', async () => {
    docSpy.mockImplementation(() => ({
      ...originalDocument,
      clientWidth: 500
    }))
    await waitRAF();
    expect(mockCallback).toHaveBeenCalledTimes(2)
  })

  it('it should fire on different dimension screen resize', async () => {
    docSpy.mockImplementation(() => ({
      ...originalDocument,
      clientHeight: 1000
    }))
    await waitRAF();
    expect(mockCallback).toHaveBeenCalledTimes(3)
  })

  afterAll(() => {
    removeResizeListener(mockCallback)
    jest.clearAllMocks();
  })
})

describe('When removeResizeListener removes a callback', () => {
  const mockCallback = jest.fn()

  beforeAll(() => {
    addResizeListener(mockCallback)
    removeResizeListener(mockCallback)
  })

  it('it shouldn\'t fire on resize', async () => {
    docSpy.mockImplementation(() => ({
      ...originalDocument,
      clientWidth: 500
    }))
    await waitRAF();
    expect(mockCallback).toHaveBeenCalledTimes(0)
  })

  afterAll(() => {
    jest.clearAllMocks();
  })
})
