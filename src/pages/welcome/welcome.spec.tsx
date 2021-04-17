import { WelcomePage } from './welcome';
import { TestHelpers } from 'fyord';

describe('WelcomePage', () => {
  let classUnderTest: WelcomePage;

  beforeEach(() => {
    classUnderTest = new WelcomePage();
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should render html', async () => {
    expect(await classUnderTest.Html()).toBeDefined();
  });

  it('should have appropriate behavior', async () => {
    document.body.innerHTML = await classUnderTest.Render();

    setTimeout(() => {
      // fire any attached events
    });

    const behaviorExpectationsMet = await TestHelpers.TimeLapsedCondition(() => {
      return true; // assertions proving expected behavior was met
    });
    expect(behaviorExpectationsMet).toBeTruthy();
  });
});
