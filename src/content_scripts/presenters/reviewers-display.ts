export default class ReviwersDisplay {
  static reviewersDom = (() => {
    const reviewersDom =
      document.querySelector<HTMLDivElement>('.sidebar-assignee');
    if (!reviewersDom) {
      throw new Error('not found reviewer dom');
    }
    return reviewersDom;
  })();

  static disable(): void {
    this.reviewersDom.style.cursor = 'not-allowed';
    (this.reviewersDom.children[0] as HTMLFormElement).style.pointerEvents =
      'none';
  }

  static enable(): void {
    this.reviewersDom.style.cursor = 'auto';
    (this.reviewersDom.children[0] as HTMLFormElement).style.pointerEvents =
      'auto';
  }
}
