import { constants } from 'http2'

export enum SuccessStatusCode {
  OK = constants.HTTP_STATUS_OK,
  NoContent = constants.HTTP_STATUS_NO_CONTENT,
}
