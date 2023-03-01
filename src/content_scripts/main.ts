import emit from './events/emit';
import { EventType } from './events/event-handler';
import { ContextMessage } from '../context_message/messages';

const successMessage = 'All checks have passed';
const failureMessage1 = 'Some checks were not successful';
const inProgressMessage = 'Some checks haven’t completed yet';

const actionsStatusTextList = [
  failureMessage1,
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
    [failureMessage1]: 'fail',
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

const emitEventByActionStatusMessage = async (actionsStatusMessage: string) => {
  await emit(actionsStatusMessageToStatus(actionsStatusMessage));
};

let timeoutId: number;
const initialize = () => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(async () => {
    await emit('init');
  }, 1000);
};

const observeGithub = async () => {
  const observer = new MutationObserver(initialize);

  observer.observe(document.body, {
    attributes: false,
    childList: true,
    subtree: true,
  });
  initialize();
};

// SPA のため URL が変更されても再読み込みされない事がある。
// なので DOM の変更を監視して処理を実行する。
observeGithub();

chrome.runtime.onMessage.addListener((request: ContextMessage) => {
  if (request.eventName === 'DISABLE_REVIEW_GUARD_EVENT') {
    emit('disable_review_guard');
  }
});

const createWatchGithubActionsStatus = () => {
  let prevStatusMessage = '';

  return () => {
    const currentStatusMessage = getActionsStatusMessageDom();
    if (prevStatusMessage === currentStatusMessage || !currentStatusMessage) {
      return;
    }
    prevStatusMessage = currentStatusMessage;
    emitEventByActionStatusMessage(currentStatusMessage);
  };
};

// Github Actions の ステータスを監視する
setInterval(createWatchGithubActionsStatus(), 1000);
