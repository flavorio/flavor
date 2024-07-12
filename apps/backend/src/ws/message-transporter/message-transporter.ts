import { EventEmitter2, Listener } from 'eventemitter2';
import {
  ConnectionState,
  ConnectionStateEvent,
  DisconnectReason,
  Message,
  MessageType,
} from './message';
import { TransportAdapter } from './transport-adaptor';

export class MessageTransporter extends EventEmitter2 {
  private transportAdapter: TransportAdapter | undefined;

  private destroyOnMessageEventHandler: (() => void) | undefined;
  private destroyOnErrorEventHandler: (() => void) | undefined;
  private destroyOnCloseEventHandler: (() => void) | undefined;
  private destroyOnConnectedEventHandler: (() => void) | undefined;

  private thisSideReady = false;
  private otherSideReady = false;
  private readyInterval: NodeJS.Timeout | undefined;

  public isConnected(): boolean {
    return this.getConnectionState() === ConnectionState.connected;
  }

  public isReady(): boolean {
    return this.thisSideReady && this.otherSideReady
  }

  public doAsSoonAsReady(callback: () => void): Listener {
    if (this.isReady()) {
      callback()
    }
    return this.on('ready', callback, {
      objectify: true
    }) as Listener
  }


  public getConnectionState(): ConnectionState {
    return (
      this.transportAdapter?.getConnectionState() ??
      ConnectionState.disconnected
    );
  }

  public setAdapter(adapter: TransportAdapter) {
    if (adapter.getConnectionState() !== ConnectionState.connected) {
      throw new Error('Websocket must be connected');
    }
    this.unbindEventsFromPreviousWebsocket();
    this.thisSideReady = false;
    this.otherSideReady = false;
    this.transportAdapter = adapter;
    this.bindWebsocketEvents(adapter);

    if(this.isConnected()) {
      this.onConnected();
    } else {
      // TODO
      console.debug('WHY');
      this.destroyOnConnectedEventHandler = adapter.bindOnConnectedEvent(
        this.onConnected.bind(this)
      )
    }
  }

  protected onConnected(): void {
    this.destroyOnConnectedEventHandler?.()
    this.destroyOnConnectedEventHandler = undefined
    this.emit(ConnectionStateEvent.connected)
  }

  private bindWebsocketEvents(transportAdapter: TransportAdapter) {
    this.destroyOnErrorEventHandler = transportAdapter.bindOnErrorEvent(
      this.onDisconnecting.bind(this),
    );
    this.destroyOnCloseEventHandler = transportAdapter.bindOnCloseEvent(
      this.onDisconnecting.bind(this),
    );
    this.destroyOnMessageEventHandler = transportAdapter.bindOnMessageEvent(
      this.receiveMessage.bind(this),
    );
  }

  private unbindEventsFromPreviousWebsocket() {
    if (this.transportAdapter) {
      this.destroyOnMessageEventHandler?.();
      this.destroyOnCloseEventHandler?.();
      this.destroyOnErrorEventHandler?.();

      this.destroyOnMessageEventHandler = undefined;
      this.destroyOnCloseEventHandler = undefined;
      this.destroyOnErrorEventHandler = undefined;
    }
  }

  protected onDisconnecting(reason?: DisconnectReason) {
    if (this.transportAdapter === undefined) {
      return;
    }
    this.stopSendingOfReadyRequests();
    this.unbindEventsFromPreviousWebsocket();
    this.thisSideReady = false;
    this.otherSideReady = false;
    this.transportAdapter = undefined;
    this.emit(ConnectionStateEvent.disconnected, reason);
  }

  protected stopSendingOfReadyRequests() {
    if (this.readyInterval !== undefined) {
      clearInterval(this.readyInterval);
      this.readyInterval = undefined;
    }
  }

  public markAsReady() {
    this.thisSideReady = true;
    this.startSendingOfReadyRequests();
  }

  protected startSendingOfReadyRequests() {
    this.readyInterval = setInterval(() => {
      this.sendMessage({
        type: MessageType.readyRequest,
      });
    }, 400);
    this.sendMessage({
      type: MessageType.readyRequest,
    });
  }

  protected receiveMessage<L extends MessageType>(message: Message<L>) {
    if (!this.thisSideReady) {
      return;
    }
    if (message.type === MessageType.readyRequest) {
      this.sendMessage({ type: MessageType.readyAnswer });
      return;
    }
    if (message.type === MessageType.readyAnswer) {
      this.processReadyAnswer();
      return;
    }
    this.emit(message.type, message);
  }

  private processReadyAnswer() {
    this.stopSendingOfReadyRequests();
    if (this.otherSideReady) {
      return;
    }
    this.otherSideReady = true;
    this.emit('ready');
  }

  public sendMessage<M extends MessageType>(content: Message<M>) {
    if (this.transportAdapter === undefined) {
      console.debug(
        "Can't send message without transport adapter. Message that couldn't be sent was",
        content,
      );
      return;
    }

    if (!this.isConnected()) {
      this.onDisconnecting();
      console.debug(
        "Can't send message over closed connection. Triggering onDisconencted event. Message that couldn't be sent was",
        content,
      );
      return;
    }

    if (
      !this.thisSideReady &&
      content.type !== MessageType.readyRequest &&
      content.type !== MessageType.readyAnswer
    ) {
      throw new Error("Can't send message. This side isn't ready");
    }

    if (
      !this.otherSideReady &&
      content.type !== MessageType.readyRequest &&
      content.type !== MessageType.readyAnswer
    ) {
      throw new Error("Can't send message. Other side isn't ready");
    }

    try {
      this.transportAdapter.send(content);
    } catch (error: unknown) {
      this.disconnect();
      throw error;
    }
  }

  public disconnect(): void {
    this.transportAdapter?.disconnect();
    this.onDisconnecting();
  }
}
