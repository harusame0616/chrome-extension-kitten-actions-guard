export default class ReviwersDisplay {
  static getReviewersDom() {
    const dom = document.querySelector<HTMLDivElement>('.sidebar-assignee');
    if (!dom) {
      throw new Error('reviewers is not found');
    }
    return dom;
  }

  static disable() {
    const reviewersDom = this.getReviewersDom();
    if (!reviewersDom) {
      return;
    }

    reviewersDom.style.cursor = 'not-allowed';
    (reviewersDom.children[0] as HTMLFormElement).style.pointerEvents = 'none';
  }

  static enable() {
    const reviewersDom = this.getReviewersDom();
    if (!reviewersDom) {
      return;
    }

    reviewersDom.style.cursor = 'auto';
    (reviewersDom.children[0] as HTMLFormElement).style.pointerEvents = 'auto';
  }
}
