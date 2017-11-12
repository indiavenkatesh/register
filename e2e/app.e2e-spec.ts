import { HclPage } from './app.po';

describe('hcl App', () => {
  let page: HclPage;

  beforeEach(() => {
    page = new HclPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
