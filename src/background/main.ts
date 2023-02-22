import { DisableReviewGuardEvent } from '../context_message/messages';

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) {
    return;
  }

  await chrome.tabs.sendMessage<DisableReviewGuardEvent>(tab.id, {
    eventName: 'DISABLE_REVIEW_GUARD_EVENT',
  });
});
