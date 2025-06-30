import { IRtc } from '../interface/IRtc';

export const AgoraRtcEvent = {
  UserLeft: 'user left',
  UserJoined: 'user-joined',
  UserUnpublished: 'user-unpublished',
  UserPublished: 'user-published',
};

export const AgoraRtcMediaType = {
  Video: 'video',
  Audio: 'audio',
};

export const RTC: IRtc = {
  client: null,
  localAudioTrack: null,
  localVideoTrack: null,
};

export const AgoraStatus = {
  Restricted: 'Restricted',
};
