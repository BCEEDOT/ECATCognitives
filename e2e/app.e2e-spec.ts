import { EcatClientPage } from './app.po';

describe('ecat-client App', () => {
  let page: EcatClientPage;

  beforeEach(() => {
    page = new EcatClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
