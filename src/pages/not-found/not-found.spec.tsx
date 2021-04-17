import { TestHelpers, Route } from 'fyord';
import { NotFoundPage } from './not-found';

describe('NotFoundPage', () => {
  let classUnderTest: NotFoundPage;
  const pageMocks = TestHelpers.GetComponentMocks();

  beforeEach(() => {
    classUnderTest = new NotFoundPage(
      pageMocks.mockSeoService.Object,
      pageMocks.mockApp.Object,
      pageMocks.mockDocument.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should always return true for route matches', () => {
    expect(classUnderTest.Route()).toBeTruthy();
  });

  it('should render', async () => {
    expect(await classUnderTest.Render()).toBeTruthy();
  });

  it('should render a message including the decoded uri of the current url', async () => {
    const route = { path: 'fake%20page' } as Route;
    const expected = 'fake page';

    const htmlString = JSON.stringify(await classUnderTest.Html(route));

    expect(htmlString).toContain(expected);
  });
});
