import ActionsStatusDisplay from '../presenters/actions-status-display';
import ReviwersDisplay from '../presenters/reviewers-display';

export const events = [
  'processing',
  'passed',
  'failed',
  'init',
  'unknown',
  'disable_review_guard',
] as const;

export type EventType = typeof events[number];
export default async (event: EventType) => {
  try {
    switch (event) {
      case 'processing':
        await ActionsStatusDisplay.changeStatus(event);
        ReviwersDisplay.disable();
        break;
      case 'passed':
        await ActionsStatusDisplay.changeStatus(event);
        ReviwersDisplay.enable();
        break;
      case 'failed':
        await ActionsStatusDisplay.changeStatus(event);
        ReviwersDisplay.disable();
        break;
      case 'disable_review_guard':
        ReviwersDisplay.enable();
        break;
      default:
        break;
    }
  } catch (e) {
    console.error(e);
  }
};
