import eventEmits from './events/event-emits';
import { EventType } from './events/event-handler';

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
  await eventEmits(actionsStatusMessageToStatus(actionsStatusMessage));
};

const main = async () => {
  await eventEmits('init');

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

const githubLocationObserve = () => {
  const lunchMainWhenConversation = () => {
    if (/^https:\/\/github.com\/.*\/pull\/[0-9]+$/.test(window.location.href)) {
      main();
    }
  };
  const observer = new MutationObserver(lunchMainWhenConversation);
  observer.observe(document.body.children[0], {
    attributes: false,
    childList: true,
    subtree: false,
  });
  lunchMainWhenConversation();
};

githubLocationObserve();