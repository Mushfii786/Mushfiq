export type LogEventType = 'CREATE' | 'UPDATE' | 'DELETE' | 'FETCH_SUCCESS' | 'FETCH_ERROR' | 'SAVE' | 'RESET';

export interface ActivityLogItem {
  id: string;
  timestamp: number;
  type: LogEventType;
  target: 'photography' | 'videography' | 'credentials' | 'contact' | 'system';
  description: string;
  status: 'success' | 'error' | 'info';
}

class ActivityLogger {
  private listeners: ((logs: ActivityLogItem[]) => void)[] = [];
  private logs: ActivityLogItem[] = [
    {
      id: 'init-1',
      timestamp: Date.now() - 10000,
      type: 'FETCH_SUCCESS',
      target: 'system',
      description: 'Activity logger and audit trail initialized.',
      status: 'success'
    }
  ];

  public getLogs(): ActivityLogItem[] {
    return this.logs;
  }

  public log(type: LogEventType, target: 'photography' | 'videography' | 'credentials' | 'contact' | 'system', description: string, status: 'success' | 'error' | 'info' = 'success') {
    const newItem: ActivityLogItem = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      type,
      target,
      description,
      status
    };
    this.logs = [newItem, ...this.logs.slice(0, 99)];
    this.notify();
  }

  public subscribe(listener: (logs: ActivityLogItem[]) => void) {
    this.listeners.push(listener);
    listener(this.logs);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this.logs);
    }
  }

  public clear() {
    this.logs = [];
    this.notify();
  }
}

export const activityLogger = new ActivityLogger();
