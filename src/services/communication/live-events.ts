export type ConversationLiveEvent = {
  type: "conversation:message";
  tenantSlug: string;
  threadId: string;
  thread: {
    id: string;
    subject: string;
    status: string;
    updatedAt: string;
  };
  message: {
    id: string;
    senderRole: string;
    body: string;
    createdAt: string;
  };
};

type ConversationLiveListener = (event: ConversationLiveEvent) => void;

const globalLiveEvents = globalThis as typeof globalThis & {
  __photaazConversationListeners?: Set<ConversationLiveListener>;
};

function getListeners() {
  if (!globalLiveEvents.__photaazConversationListeners) {
    globalLiveEvents.__photaazConversationListeners = new Set();
  }

  return globalLiveEvents.__photaazConversationListeners;
}

export function subscribeToConversationEvents(listener: ConversationLiveListener) {
  const listeners = getListeners();
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function publishConversationEvent(event: ConversationLiveEvent) {
  getListeners().forEach((listener) => listener(event));
}
