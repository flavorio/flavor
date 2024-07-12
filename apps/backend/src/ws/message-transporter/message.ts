export enum MessageType {
    ping = 'ping',
    pong = 'pong',

    readyRequest = 'readyRequest',
    readyAnswer = 'readyAnswer',

    subscribePage = 'subscribePage',
    unsubscribePage = 'unsubscribePage',
    subscribeWorkspace = 'subscribeWorkspace',
    unsubscribeWorkspace = 'unsubscribeWorkspace',

    updatePageRealtimeUsers = 'updatePageRealtimeUsers',
    updateBlockVersion = 'updateBlockVersion',
}

export enum ConnectionStateEvent {
    ready = 'ready',
    connected = ' connected',
    disconnected = 'disconnected',
}


export enum ConnectionState {
    disconnected = 'disconnected',
    connecting = 'connecting',
    connected = 'connected'
}

export enum DisconnectReason {
    userNotPermitted = 4000
}

export interface MessagePayloads {

}

export type Message<T extends MessageType> = T extends keyof MessagePayloads
    ? {
        type: T
        payload: MessagePayloads[T]
    }
    : {
        type: T
    }
