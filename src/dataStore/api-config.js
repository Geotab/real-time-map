import { LOGRECORD, EXCEPTIONEVENT } from "../constants/feed-type-names";

export const apiConfig = {
   api: undefined,
   state: undefined,
   feedTypesToGet: [LOGRECORD, EXCEPTIONEVENT],
   resultsLimit: 60000,
};

export const userInfo = {
   userName: "",
   database: "",
   sessionId: "",
   server: "",

   setUserInfo: (user, db, session, server) => {
      userInfo.userName = user;
      userInfo.database = db;
      userInfo.sessionId = session;
      userInfo.server = server;
   }
};