import { LOGRECORD, EXCEPTIONEVENT } from '../constants/feed-type-names';

export const apiConfig = {
  api: undefined,
  feedTypesToGet: [LOGRECORD, EXCEPTIONEVENT],
  resultsLimit: 60000,
};

export const userInfo = {
  userName: "",
  database: "",
  sessionId: "",

  setUserInfo: (user, db, session) => {
    userInfo.userName = user;
    userInfo.database = db;
    userInfo.sessionId = session;
  }
};