import { Injectable, NotFoundException } from '@nestjs/common';
import { RoomSnapshot, TLSocketRoom } from '@tldraw/sync-core';
import { DocumentService } from 'src/api/document/document.service';

interface RoomState {
  room: TLSocketRoom<any, void>;
  id: string;
  needsPersist: boolean;
}

let mutex = Promise.resolve<null | Error>(null);

@Injectable()
export class RealtimeService {
  constructor(private readonly documentService: DocumentService) {
    setInterval(() => {
      for (const roomState of this.rooms.values()) {
        if (roomState.needsPersist) {
          // persist room
          roomState.needsPersist = false;
          console.log('saving snapshot', roomState.id);
          this.saveSnapshot(roomState.id, roomState.room.getCurrentSnapshot());
        }
        if (roomState.room.isClosed()) {
          console.log('deleting room', roomState.id);
          this.rooms.delete(roomState.id);
        }
      }
    }, 2000);
  }
  private readonly rooms = new Map<string, RoomState>();

  async readSnapshot(roomId: string) {
    const doc = await this.documentService.findDocument(roomId);
    if (doc) return doc.snapshot as any as RoomSnapshot;
    throw new NotFoundException('Document not found');
  }

  async saveSnapshot(roomId: string, snapshot: RoomSnapshot) {
    await this.documentService.updateDocumentSnapshot(roomId, snapshot);
  }

  public async makeOrLoadRoom(roomId: string) {
    mutex = mutex
      .then(async () => {
        if (this.rooms.has(roomId)) {
          const roomState = this.rooms.get(roomId)!;
          if (!roomState.room.isClosed()) {
            return null; // all good
          }
        }
        console.log('loading room', roomId);
        const initialSnapshot = await this.readSnapshot(roomId);

        const roomState: RoomState = {
          needsPersist: false,
          id: roomId,
          room: new TLSocketRoom({
            initialSnapshot,
            onSessionRemoved(room, args) {
              console.log('client disconnected', args.sessionId, roomId);
              if (args.numSessionsRemaining === 0) {
                console.log('closing room', roomId);
                room.close();
              }
            },
            onDataChange() {
              roomState.needsPersist = true;
            },
          }),
        };
        this.rooms.set(roomId, roomState);
        return null; // all good
      })
      .catch((error) => {
        // return errors as normal values to avoid stopping the mutex chain
        return error;
      });

    const err = await mutex;
    if (err) throw err;
    return this.rooms.get(roomId)!.room;
  }
}
