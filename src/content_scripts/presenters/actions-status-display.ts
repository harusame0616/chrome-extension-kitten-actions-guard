const actionsStatusContainerClassName = 'kag-actions-status-container';
const statusTextClassName = 'kag-status-text';

export default class ActionsStatusDisplay {
  private static createActionsStatusContainerDOM(
    labelDOM: HTMLDivElement,
    statusTextDOM: HTMLDivElement
  ) {
    const actionsStatusContainerDOM = document.createElement('div');
    actionsStatusContainerDOM.classList.add(
      actionsStatusContainerClassName,
      'discussion-sidebar-item',
      'sidebar-actions-status',
      'js-discussion-sidebar-item',
      'position-relative'
    );

    actionsStatusContainerDOM.appendChild(labelDOM);
    actionsStatusContainerDOM.appendChild(statusTextDOM);

    return actionsStatusContainerDOM;
  }

  private static createLabelDOM() {
    const labelDOM = document.createElement('div');
    labelDOM.innerHTML = 'Actions status';
    labelDOM.style.paddingTop = '4px';
    labelDOM.classList.add('text-bold', 'discussion-sidebar-heading');

    return labelDOM;
  }

  private static createStatusTextDOM() {
    const statusTextDOM = document.createElement('div');
    statusTextDOM.classList.add(statusTextClassName);
    statusTextDOM.innerHTML = '-';

    return statusTextDOM;
  }

  private static isCreated() {
    return !!document.querySelector<HTMLDivElement>(
      `.${actionsStatusContainerClassName}`
    );
  }

  static async initialize() {
    if (this.isCreated()) {
      return;
    }

    const actionsStatusContainerDOM = this.createActionsStatusContainerDOM(
      this.createLabelDOM(),
      this.createStatusTextDOM()
    );

    const reviewersDom = await new Promise<HTMLDivElement>((r) => {
      const intervalId = setInterval(() => {
        const dom = document.querySelector<HTMLDivElement>('.sidebar-assignee');
        if (!dom) {
          return;
        }
        r(dom);
        clearInterval(intervalId);
      }, 100);
    });

    if (!reviewersDom.parentElement) {
      throw new Error('not found reviewers dom');
    }

    reviewersDom.parentElement.insertBefore(
      actionsStatusContainerDOM,
      reviewersDom
    );
  }

  static changeStatus(status: string) {
    const statusTextDOM = document.querySelector<HTMLDivElement>(
      `.${actionsStatusContainerClassName} .${statusTextClassName}`
    );
    if (!statusTextDOM) {
      throw new Error('Actions Status DOM is not found.');
    }

    statusTextDOM.innerHTML = `<span style="color:${this.toColor(
      status
    )}">${status}</span>`;
  }

  static toColor(status: string) {
    const colorMap: { [key: string]: string } = {
      passed: '#238636',
      processing: '#d29922',
      failed: '#f85149',
    };
    return colorMap[status] ?? 'white';
  }
}
