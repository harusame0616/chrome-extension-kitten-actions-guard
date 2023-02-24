const actionsStatusContainerClassName = 'kag-actions-status-container';
const statusTextClassName = 'kag-status-text';

export default class ActionsStatusDisplay {
  static async initialize() {
    let actionsStatusContainerDOM = document.querySelector<HTMLDivElement>(
      `.${actionsStatusContainerClassName}`
    );

    if (actionsStatusContainerDOM) {
      return;
    }

    actionsStatusContainerDOM = document.createElement('div');
    actionsStatusContainerDOM.classList.add(
      actionsStatusContainerClassName,
      'discussion-sidebar-item',
      'sidebar-actions-status',
      'js-discussion-sidebar-item',
      'position-relative'
    );

    const labelDOM = document.createElement('div');
    labelDOM.innerHTML = 'Actions status';
    labelDOM.style.paddingTop = '4px';
    labelDOM.classList.add('text-bold', 'discussion-sidebar-heading');

    const statusTextDOM = document.createElement('div');
    statusTextDOM.classList.add(statusTextClassName);
    statusTextDOM.innerHTML = '-';

    actionsStatusContainerDOM.appendChild(labelDOM);
    actionsStatusContainerDOM.appendChild(statusTextDOM);

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
    const colorMap: { [key: string]: string } = {
      passed: '#238636',
      processing: '#d29922',
      fail: '#f85149',
    };
    const color = colorMap[status] ?? 'white';

    const statusTextDOM = document.querySelector<HTMLDivElement>(
      `.${actionsStatusContainerClassName} .${statusTextClassName}`
    );
    if (!statusTextDOM) {
      throw new Error('Actions Status DOM is not found.');
    }
    statusTextDOM.innerHTML = `<span style="color:${color}">${status}</span>`;
  }
}
