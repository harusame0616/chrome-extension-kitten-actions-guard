import emit from './events/emit';
import { EventType } from './events/event-handler';
import { ContextMessage } from '../context_message/messages';

const actionsStatusTextList = [
  'Some checks were not successful',
  'Some checks haven’t completed yet',
  'All checks have passed',
] as const;
type ActionsStatusText = typeof actionsStatusTextList[number];

const isActionStatusText = (v: string): v is ActionsStatusText =>
  (actionsStatusTextList as unknown as string[]).includes(v);

const actionsStatusMessageToStatus = (message: string) => {
  if (!isActionStatusText(message)) {
    return 'unknown';
  }

  const statusMap: { [key in ActionsStatusText]: EventType } = {
    'Some checks were not successful': 'fail',
    'Some checks haven’t completed yet': 'processing',
    'All checks have passed': 'passed',
  };

  return statusMap[message];
};

const getActionsStatusMessageDom = () =>
  new Promise<HTMLHeadingElement>((r) => {
    const intervalId = setInterval(() => {
      const statusHeadingDOMList = Array.from(
        document.querySelectorAll<HTMLHeadingElement>('.status-heading')
      );

      // Actions 以外のDOMも含まれるためステータスメッセージから Actions の DOM を探す
      const actionsStatusDom = statusHeadingDOMList.find((statusHeadingDOM) =>
        (actionsStatusTextList as unknown as string).includes(
          statusHeadingDOM.innerText
        )
      );
      if (!actionsStatusDom) {
        return;
      }

      clearInterval(intervalId);
      r(actionsStatusDom);
    }, 1000);
  });

const emitEventByActionStatusMessage = async (actionsStatusMessage: string) => {
  await emit(actionsStatusMessageToStatus(actionsStatusMessage));
};

const main = async () => {
  await emit('init');

  const actionsStatusMessageDom = await getActionsStatusMessageDom();

  // Actions の ステータスメッセージを監視ししてイベントを発火させる
  const observer = new MutationObserver(async (mutations) => {
    const newActionsStatusMessage = mutations[0].target.textContent ?? '';
    await emitEventByActionStatusMessage(newActionsStatusMessage);
  });
  observer.observe(actionsStatusMessageDom, {
    subtree: true,
    characterData: true,
  });

  // 初回の状態を反映させる
  await emitEventByActionStatusMessage(actionsStatusMessageDom.innerText);
};

const observeGithub = () => {
  const lunchMainWhenConversation = () => {
    if (/^https:\/\/github.com\/.*\/pull\/[0-9]+$/.test(window.location.href)) {
      main();
    }
  };

  let lastInitUrl = '';
  const observer = new MutationObserver(() => {
    // 要素ごとの変更でコールバックされるため、
    // 同一URLでは１回だけ実行されるように
    if (lastInitUrl === window.location.href) {
      return;
    }
    lastInitUrl = window.location.href;

    lunchMainWhenConversation();
  });
  observer.observe(document.body, {
    attributes: false,
    childList: true,
    subtree: true,
  });
  lunchMainWhenConversation();
};

// SPA のため URL が変更されても再読み込みされない事がある。
// なので DOM の変更を監視して処理を実行する。
observeGithub();

chrome.runtime.onMessage.addListener((request: ContextMessage) => {
  if (request.eventName === 'DISABLE_REVIEW_GUARD_EVENT') {
    emit('disable_review_guard');
  }
});
