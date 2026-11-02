import { EventEmitter } from 'events';

export interface SubmissionStatusEvent {
  status: string;
  submissionId: string;
  jobId?: string;
  message?: string;
  aiData?: any;
  timestamp?: string;
}

class EventBroker extends EventEmitter {
  constructor() {
    super();
    // Allow high number of concurrent client listeners
    this.setMaxListeners(2500);
  }
}

// Global Event Broker for SSE and real-time client notifications
export const submissionEventBroker = new EventBroker();

export function broadcastSubmissionStatus(
  submissionId: string,
  event: SubmissionStatusEvent
) {
  event.timestamp = event.timestamp || new Date().toISOString();
  submissionEventBroker.emit(`submission:${submissionId}`, event);
  submissionEventBroker.emit('all_submissions', event);
}
