import ActionsStatusDisplay from '../presenters/actions-status-display';
import ReviwersDisplay from '../presenters/reviewers-display';

export const events = [
  'processing',
  'passed',
  'fail',
  'init',
  'unknown',
  'disable_review_guard',
] as const;

export type EventType = typeof events[number];
export default async (event: EventType) => {
  try {
    switch (event) {
      case 'processing':
        ActionsStatusDisplay.changeStatus(event);
        ReviwersDisplay.disable();
        break;
      case 'passed':
        ActionsStatusDisplay.changeStatus(event);
        ReviwersDisplay.enable();
        break;
      case 'fail':
        ActionsStatusDisplay.changeStatus(event);
        ReviwersDisplay.disable();
        break;
      case 'init':
        await ActionsStatusDisplay.initialize();
        await ReviwersDisplay.initialize();
        break;
      case 'disable_review_guard':
        ReviwersDisplay.enable();
        break;
      default:
        throw new Error('unknown event');
    }
  } catch (e) {
    console.error(e);
  }
};
