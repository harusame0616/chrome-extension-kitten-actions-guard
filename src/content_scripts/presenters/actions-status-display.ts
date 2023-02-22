export default class ActionsStatusDisplay {
  static actionStatusDom = document.createElement('div');

  static labelDom = document.createElement('div');

  static statusDom = document.createElement('div');

  static actionStatusSrcDom: HTMLDivElement | null = null;

  static async initialize() {
    this.actionStatusDom.classList.add(
      'discussion-sidebar-item',
      'sidebar-actions-status',
      'js-discussion-sidebar-item',
      'position-relative'
    );
    this.actionStatusDom.appendChild(this.labelDom);
    this.actionStatusDom.appendChild(this.statusDom);
    this.labelDom.innerHTML = 'Actions status';
    this.statusDom.innerHTML = '-';

    const reviewersDom = await new Promise<HTMLDivElement>((r) => {
      const intervalId = setInterval(() => {
        const dom = document.querySelector<HTMLDivElement>('.sidebar-assignee');
        if (!dom) {
          return;
        }
        r(dom);
        clearInterval(intervalId);
      }, 200);
    });

    if (!reviewersDom.parentElement) {
      throw new Error('not found reviewers dom');
    }

    reviewersDom.parentElement.insertBefore(this.actionStatusDom, reviewersDom);
  }

  static changeStatus(status: string) {
    const colorMap: { [key: string]: string } = {
      passed: '#238636',
      processing: '#d29922',
      fail: '#f85149',
    };
    const color = colorMap[status] ?? 'white';

    this.statusDom.innerHTML = `<span style="color:${color}">${status}</span>`;
  }
}
