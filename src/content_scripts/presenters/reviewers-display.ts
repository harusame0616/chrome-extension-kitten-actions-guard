export default class ReviwersDisplay {
  static reviewersDom: HTMLDivElement | null;

  static async initialize() {
    this.reviewersDom = await new Promise<HTMLDivElement>((r) => {
      const intervalId = setInterval(() => {
        const dom = document.querySelector<HTMLDivElement>('.sidebar-assignee');
        if (!dom) {
          return;
        }
        r(dom);
        clearInterval(intervalId);
      }, 200);
    });

    this.disable();
  }

  static disable(): void {
    if (!this.reviewersDom) {
      throw new Error('DOM is not found');
    }

    this.reviewersDom.style.cursor = 'not-allowed';
    (this.reviewersDom.children[0] as HTMLFormElement).style.pointerEvents =
      'none';
  }

  static enable(): void {
    if (!this.reviewersDom) {
      throw new Error('DOM is not found');
    }

    this.reviewersDom.style.cursor = 'auto';
    (this.reviewersDom.children[0] as HTMLFormElement).style.pointerEvents =
      'auto';
  }
}
