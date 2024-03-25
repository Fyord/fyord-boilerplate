import { Expect } from 'tsmockit';
import { Asap } from 'fyord';
import { WelcomePage } from './welcome';

describe('WelcomePage', () => {
  let classUnderTest: WelcomePage;

  beforeEach(() => {
    classUnderTest = new WelcomePage();
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should render html', async () => {
    expect(await classUnderTest.Template()).toBeDefined();
  });

  it('should return true for route when at root', async () => {
    expect(await classUnderTest.Route({
      path: '/'
    } as any)).toEqual(true);
  });

  it('should return false for route when not at root', async () => {
    expect(await classUnderTest.Route({
      path: '/asdf'
    } as any)).toEqual(false);
  });

  it('should have appropriate behavior', async () => {
    document.body.innerHTML = await classUnderTest.Render();

    Asap(() => {
      // fire any attached events
    });

    await Expect(
      () => true, // returns the result of this function once truthy to the following function for assertions
      (m) => m.toBeTruthy());
  });
});
