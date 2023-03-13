import emit from './events/emit';
import { EventType } from './events/event-handler';
import { ContextMessage } from '../context_message/messages';

const successMessage = 'All checks have passed';
const failureMessage1 = 'Some checks were not successful';
const failureMessage2 = 'All checks have failed';
const inProgressMessage = 'Some checks haven’t completed yet';

const actionsStatusTextList = [
  failureMessage1,
  failureMessage2,
  inProgressMessage,
  successMessage,
] as const;

type ActionsStatusText = typeof actionsStatusTextList[number];

const isActionStatusText = (v: string): v is ActionsStatusText =>
  (actionsStatusTextList as unknown as string[]).includes(v);

const actionsStatusMessageToStatus = (message: string) => {
  if (!isActionStatusText(message)) {
    return 'unknown';
  }

  const statusMap: { [key in ActionsStatusText]: EventType } = {
    [failureMessage1]: 'failed',
    [failureMessage2]: 'failed',
    [inProgressMessage]: 'processing',
    [successMessage]: 'passed',
  };

  return statusMap[message];
};

const getActionsStatusMessageDom = () => {
  const statusHeadingDOMList = Array.from(
    document.querySelectorAll<HTMLHeadingElement>('.status-heading')
  );

  // Actions 以外のDOMも含まれるためステータスメッセージから Actions の DOM を探す
  const actionsStatusDom = statusHeadingDOMList.find((statusHeadingDOM) =>
    (actionsStatusTextList as unknown as string).includes(
      statusHeadingDOM.innerText
    )
  );
  return actionsStatusDom?.innerText;
};

chrome.runtime.onMessage.addListener((request: ContextMessage) => {
  if (request.eventName === 'DISABLE_REVIEW_GUARD_EVENT') {
    emit('disable_review_guard');
  }
});

const isCheckPage = () =>
  /^https:\/\/github.com\/.*\/pull\/[0-9]+$/.test(window.location.href);

setInterval(() => {
  if (!isCheckPage()) {
    return;
  }

  const actionsStatusMessage = getActionsStatusMessageDom() ?? '';
  const status = actionsStatusMessageToStatus(actionsStatusMessage);

  emit(status);
}, 2000);
