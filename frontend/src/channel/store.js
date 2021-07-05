import { writable } from "svelte/store";

export const createChannelStore = (channelId) => {
  const { subscribe, set, update } = writable([]);

  const eventSource = new EventSource(
    `https://6d86a4205640.ngrok.io/${channelId}/listen`
  );

  eventSource.onmessage = (e) => {
    update((messages) => messages.concat(JSON.parse(e.data)));

  };

  return {
    subscribe,
    reset: () => set([]),
    close: eventSource.close,
  };
};