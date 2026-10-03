export interface GreenApiCredentials {
  apiUrl: string
  idInstance: string
  apiTokenInstance: string
}

export type InstanceState =
  'notAuthorized' | 'authorized' | 'blocked' | 'sleepMode' | 'starting' | 'yellowCard'

export interface GetStateInstanceResponse {
  stateInstance: InstanceState
}

export interface CheckAccountResponse {
  exist: boolean
  chatId?: string
}

export interface SendMessageRequest {
  chatId: string
  message: string
}

export interface SendMessageResponse {
  idMessage: string
}

export interface DeleteNotificationResponse {
  result: boolean
}

export interface TextMessageData {
  typeMessage: 'textMessage'
  textMessageData: { textMessage: string }
}

export interface ExtendedTextMessageData {
  typeMessage: 'extendedTextMessage'
  extendedTextMessageData: { text: string }
}

export interface UnsupportedMessageData {
  typeMessage: string
}

export type MessageData = TextMessageData | ExtendedTextMessageData | UnsupportedMessageData

export interface SenderData {
  chatId: string
  sender: string
  senderName?: string
  chatName?: string
}

export type MessageWebhookType =
  'incomingMessageReceived' | 'outgoingMessageReceived' | 'outgoingAPIMessageReceived'

export interface MessageWebhook {
  typeWebhook: MessageWebhookType
  idMessage: string
  timestamp: number
  senderData: SenderData
  messageData: MessageData
}

export type OutgoingMessageStatus =
  'pending' | 'sent' | 'delivered' | 'read' | 'failed' | 'noAccount' | 'notInGroup'

export interface OutgoingMessageStatusWebhook {
  typeWebhook: 'outgoingMessageStatus'
  idMessage: string
  chatId: string
  status: OutgoingMessageStatus
  timestamp: number
}

export interface GenericWebhook {
  typeWebhook: string
  timestamp?: number
}

export type WebhookBody = MessageWebhook | OutgoingMessageStatusWebhook | GenericWebhook

export interface Notification {
  receiptId: number
  body: WebhookBody
}
