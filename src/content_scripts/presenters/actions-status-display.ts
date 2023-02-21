export default class ActionsStatusDisplay {
  static actionStatusDom = document.createElement('div');

  static labelDom = document.createElement('div');

  static statusDom = document.createElement('div');

  static actionStatusSrcDom: HTMLDivElement | null = null;

  static initialize() {
    this.actionStatusDom.classList.add(
      'discussion-sidebar-item',
      'sidebar-actions-status',
      'js-discussion-sidebar-item',
      'position-relative'
    );
    this.actionStatusDom.appendChild(this.labelDom);
    this.actionStatusDom.appendChild(this.statusDom);
    this.labelDom.innerHTML = 'Actions status';
    this.statusDom.innerHTML = '';

    const reviewersDom = document.querySelector('.sidebar-assignee');
    if (!reviewersDom || !reviewersDom.parentElement) {
      throw new Error('not found reviewers dom');
    }

    reviewersDom.parentElement.insertBefore(this.actionStatusDom, reviewersDom);
  }

  static changeStatus(status: string) {
    const colorMap: { [key: string]: string } = {
      pass: 'green',
      processing: 'yellow',
      fail: 'red',
    };
    const color = colorMap[status] ?? 'white';

    this.statusDom.innerHTML = `<span style="color:${color}">${status}</span>`;
  }
}

ActionsStatusDisplay.initialize();
