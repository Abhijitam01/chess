import type {
  ServerInitGameMessage,
  ServerMoveMessage,
  ServerGameOverMessage,
  ServerOpponentLeftMessage,
  ServerResignMessage,
  ServerInvalidMoveMessage,
  ServerTimeUpdateMessage,
  ServerDrawOfferMessage,
  ServerDrawDeclineMessage,
  ServerLobbyCreatedMessage,
  ServerLobbyNotFoundMessage,
  ServerClockSyncMessage,
} from './messages.js';

/**
 * Union of every message the server can push to a connected client.
 * Alias of ServerMessage for use in event-handler signatures.
 */
export type ServerEvent =
  | ServerInitGameMessage
  | ServerMoveMessage
  | ServerGameOverMessage
  | ServerOpponentLeftMessage
  | ServerResignMessage
  | ServerInvalidMoveMessage
  | ServerTimeUpdateMessage
  | ServerDrawOfferMessage
  | ServerDrawDeclineMessage
  | ServerLobbyCreatedMessage
  | ServerLobbyNotFoundMessage
  | ServerClockSyncMessage;
