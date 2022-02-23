var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/server.ts
var import_http = __toESM(require("http"));

// src/routes/app.ts
var import_express2 = __toESM(require("./node_modules/express/index.js"));
var import_swagger_jsdoc = __toESM(require("./node_modules/swagger-jsdoc/index.js"));
var import_swagger_ui_express = __toESM(require("./node_modules/swagger-ui-express/index.js"));

// src/routes/index.ts
var import_express = __toESM(require("./node_modules/express/index.js"));

// src/controllers/Threads/fetchThreads.ts
var import_googleapis2 = require("./node_modules/googleapis/build/src/index.js");

// src/google/index.ts
var import_googleapis = require("./node_modules/googleapis/build/src/index.js");
var authorize = (token) => __async(void 0, null, function* () {
  const oAuth2Client = new import_googleapis.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URL);
  try {
    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client;
  } catch (err) {
    console.log("err", JSON.stringify(err));
  }
});
var authenticated = (token) => __async(void 0, null, function* () {
  return yield authorize(token);
});

// src/constants/globalConstants.ts
var USER = "me";

// src/controllers/Threads/fetchThreads.ts
var getThreads = (auth, req) => __async(void 0, null, function* () {
  const gmail = import_googleapis2.google.gmail({ version: "v1", auth });
  const requestBody = {
    userId: USER
  };
  requestBody.maxResults = typeof Number(req.query.maxResults) !== "number" ? 20 : Number(req.query.maxResults);
  if (req.query.labelIds && req.query.labelIds !== "undefined") {
    requestBody.labelIds = req.query.labelIds;
  }
  if (req.query.pageToken) {
    requestBody.pageToken = req.query.pageToken;
  }
  if (req.query.q) {
    requestBody.q = req.query.q;
  }
  try {
    const response = yield gmail.users.threads.list(requestBody);
    if (response && response.data) {
      return response.data;
    }
    return new Error("No threads found...");
  } catch (err) {
    throw Error(`Threads returned an error: ${err}`);
  }
});
var fetchThreads = (req, res) => __async(void 0, null, function* () {
  try {
    const auth = yield authenticated(req.headers.authorization);
    const response = yield getThreads(auth, req);
    return res.status(200).json(response);
  } catch (err) {
    res.status(401).json(err);
  }
});

// src/controllers/Threads/fetchFullThreads.ts
var import_googleapis3 = require("./node_modules/googleapis/build/src/index.js");
function singleThread(thread, gmail) {
  return __async(this, null, function* () {
    const { id } = thread;
    try {
      if (id) {
        const response = yield gmail.users.threads.get({
          userId: USER,
          id,
          format: "full"
        });
        if (response && response.data) {
          return response.data;
        }
      }
      throw Error("Thread not found...");
    } catch (err) {
      throw Error(`Threads returned an error: ${err}`);
    }
  });
}
var getFullThreads = (auth, req) => __async(void 0, null, function* () {
  const gmail = import_googleapis3.google.gmail({ version: "v1", auth });
  const requestBody = {
    userId: USER
  };
  requestBody.maxResults = typeof Number(req.query.maxResults) !== "number" ? 20 : Number(req.query.maxResults);
  if (req.query.labelIds && req.query.labelIds !== "undefined") {
    requestBody.labelIds = req.query.labelIds;
  }
  if (req.query.pageToken) {
    requestBody.pageToken = req.query.pageToken;
  }
  if (req.query.q) {
    requestBody.q = req.query.q;
  }
  try {
    const response = yield gmail.users.threads.list(requestBody);
    if (response && response.data) {
      const hydrateMetaList = () => __async(void 0, null, function* () {
        const results = [];
        const threads = response.data.threads;
        if (threads) {
          for (const thread of threads) {
            results.push(singleThread(thread, gmail));
          }
          return __spreadProps(__spreadValues({}, response.data), {
            threads: yield Promise.all(results)
          });
        }
      });
      return hydrateMetaList();
    }
  } catch (err) {
    throw Error(`Threads returned an error: ${err}`);
  }
});
var fetchFullThreads = (req, res) => __async(void 0, null, function* () {
  try {
    const auth = yield authenticated(req.headers.authorization);
    const response = yield getFullThreads(auth, req);
    return res.status(200).json(response);
  } catch (err) {
    res.status(401).json(err);
  }
});

// src/controllers/Threads/fetchSingleThread.ts
var import_googleapis4 = require("./node_modules/googleapis/build/src/index.js");
var getThread = (auth, req) => __async(void 0, null, function* () {
  const gmail = import_googleapis4.google.gmail({ version: "v1", auth });
  const { id } = req.params;
  try {
    const response = yield gmail.users.threads.get({
      userId: USER,
      id,
      format: "full"
    });
    if (response && response.data) {
      return response.data;
    }
    return new Error("Thread not found...");
  } catch (err) {
    throw Error(`Threads returned an error: ${err}`);
  }
});
var fetchSingleThread = (req, res) => __async(void 0, null, function* () {
  try {
    const auth = yield authenticated(req.headers.authorization);
    const response = yield getThread(auth, req);
    return res.status(200).json(response);
  } catch (err) {
    res.status(401).json(err);
  }
});

// src/controllers/Drafts/createDraft.ts
var import_googleapis5 = require("./node_modules/googleapis/build/src/index.js");

// src/utils/messageEncoding.ts
var messageEncoding = (props) => {
  const { body, subject, to, cc, bcc, sender } = props;
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject != null ? subject : "").toString("base64")}?=`;
  const messageParts = [
    `From: ${sender}`,
    `To: ${to}`,
    `Cc: ${cc}`,
    `Bcc: ${bcc}`,
    "Content-Type: text/html; charset=utf-8",
    "MIME-Version: 1.0",
    `Subject: ${utf8Subject}`,
    "",
    `${body}`
  ];
  const message = messageParts.join("\n");
  const encodedMessage = Buffer.from(message).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return encodedMessage;
};
var messageEncoding_default = messageEncoding;

// src/controllers/Drafts/createDraft.ts
var setupDraft = (auth, req) => __async(void 0, null, function* () {
  const gmail = import_googleapis5.google.gmail({ version: "v1", auth });
  const { threadId, messageId, labelIds } = req.body;
  try {
    const response = yield gmail.users.drafts.create({
      userId: USER,
      requestBody: {
        message: {
          raw: messageEncoding_default(req.body),
          id: messageId,
          threadId,
          labelIds,
          payload: {
            partId: "",
            mimeType: "text/html",
            filename: "",
            body: {
              data: messageEncoding_default(req.body)
            }
          }
        }
      }
    });
    if (response) {
      return response;
    }
    return new Error("Draft is not created...");
  } catch (err) {
    throw Error(`Create Draft returned an error ${err}`);
  }
});
var createDraft = (req, res) => __async(void 0, null, function* () {
  try {
    const auth = yield authenticated(req.headers.authorization);
    const response = yield setupDraft(auth, req);
    return res.status(200).json(response);
  } catch (err) {
    res.status(401).json(err);
  }
});

// src/controllers/Drafts/fetchDrafts.ts
var import_googleapis6 = require("./node_modules/googleapis/build/src/index.js");
var getDrafts = (auth) => __async(void 0, null, function* () {
  const gmail = import_googleapis6.google.gmail({ version: "v1", auth });
  try {
    const response = yield gmail.users.drafts.list({
      userId: USER
    });
    if (response && response.data) {
      return response.data;
    }
    return new Error("No drafts found...");
  } catch (err) {
    throw Error(`Drafts returned an error: ${err}`);
  }
});
var fetchDrafts = (req, res) => __async(void 0, null, function* () {
  try {
    const auth = yield authenticated(req.headers.authorization);
    const response = yield getDrafts(auth);
    return res.status(200).json(response);
  } catch (err) {
    res.status(401).json(err);
  }
});

// src/controllers/Drafts/fetchSingleDraft.ts
var import_googleapis7 = require("./node_modules/googleapis/build/src/index.js");
var getDraft = (auth, req) => __async(void 0, null, function* () {
  const gmail = import_googleapis7.google.gmail({ version: "v1", auth });
  try {
    const response = yield gmail.users.drafts.get({
      userId: USER,
      id: req.params.id,
      format: "full"
    });
    if (response && response.data) {
      return response.data;
    }
    return new Error("Draft not found...");
  } catch (err) {
    throw Error(`Fetching Draft returned an error ${err}`);
  }
});
var fetchSingleDraft = (req, res) => __async(void 0, null, function* () {
  try {
    const auth = yield authenticated(req.headers.authorization);
    const response = yield getDraft(auth, req);
    return res.status(200).json(response);
  } catch (err) {
    res.status(401).json(err);
  }
});

// src/controllers/Drafts/sendDraft.ts
var import_googleapis8 = require("./node_modules/googleapis/build/src/index.js");
var exportDraft = (auth, req) => __async(void 0, null, function* () {
  const gmail = import_googleapis8.google.gmail({ version: "v1", auth });
  const { id } = req.body;
  try {
    const response = yield gmail.users.drafts.send({
      userId: USER,
      requestBody: {
        id
      }
    });
    if (response) {
      return response;
    }
    return new Error("Mail was not sent...");
  } catch (err) {
    throw Error(`Sending Draft encountered an error ${err}`);
  }
});
var sendDraft = (req, res) => __async(void 0, null, function* () {
  try {
    const auth = yield authenticated(req.headers.authorization);
    const response = yield exportDraft(auth, req);
    return res.status(200).json(response);
  } catch (err) {
    res.status(401).json(err);
  }
});

// src/controllers/Drafts/updateDraft.ts
var import_googleapis9 = require("./node_modules/googleapis/build/src/index.js");
var exportDraft2 = (auth, req) => __async(void 0, null, function* () {
  const gmail = import_googleapis9.google.gmail({ version: "v1", auth });
  const { draftId, threadId, messageId, labelIds } = req.body;
  try {
    const response = yield gmail.users.drafts.update({
      userId: USER,
      id: draftId,
      requestBody: {
        message: {
          raw: messageEncoding_default(req.body),
          id: messageId,
          threadId,
          labelIds,
          payload: {
            partId: "",
            mimeType: "text/html",
            filename: "",
            body: {
              data: messageEncoding_default(req.body)
            }
          }
        }
      }
    });
    if (response) {
      return response;
    }
    return new Error("Draft is not updated...");
  } catch (err) {
    throw Error(`Draft update encountered an error ${err}`);
  }
});
var updateDraft = (req, res) => __async(void 0, null, function* () {
  try {
    const auth = yield authenticated(req.headers.authorization);
    const response = yield exportDraft2(auth, req);
    return res.status(200).json(response);
  } catch (err) {
    res.status(401).json(err);
  }
});

// src/controllers/Drafts/deleteDraft.ts
var import_googleapis10 = require("./node_modules/googleapis/build/src/index.js");
var removeDraft = (auth, req) => __async(void 0, null, function* () {
  const gmail = import_googleapis10.google.gmail({ version: "v1", auth });
  const {
    body: { id }
  } = req;
  try {
    const response = yield gmail.users.drafts.delete({
      userId: USER,
      id
    });
    return response;
  } catch (err) {
    throw Error(`Draft returned an error: ${err}`);
  }
});
var deleteDraft = (req, res) => __async(void 0, null, function* () {
  try {
    const auth = yield authenticated(req.headers.authorization);
    const response = yield removeDraft(auth, req);
    return res.status(200).json(response);
  } catch (err) {
    res.status(401).json(err);
  }
});

// src/controllers/Message/updateSingleMessage.ts
var import_googleapis11 = require("./node_modules/googleapis/build/src/index.js");
var updateMessage = (auth, req) => __async(void 0, null, function* () {
  const gmail = import_googleapis11.google.gmail({ version: "v1", auth });
  try {
    const response = yield gmail.users.threads.modify({
      userId: USER,
      id: req.params.id,
      requestBody: req.body
    });
    if (response && response.data) {
      return response.data;
    }
    return new Error("Message not found...");
  } catch (err) {
    throw Error(`Single message returned an error: ${err}`);
  }
});
var updateSingleMessage = (req, res) => __async(void 0, null, function* () {
  try {
    const auth = yield authenticated(req.headers.authorization);
    const response = yield updateMessage(auth, req);
    return res.status(200).json(response);
  } catch (err) {
    res.status(401).json(err);
  }
});

// src/controllers/Message/thrashSingleMessage.ts
var import_googleapis12 = require("./node_modules/googleapis/build/src/index.js");
var thrashMessage = (auth, req) => __async(void 0, null, function* () {
  const gmail = import_googleapis12.google.gmail({ version: "v1", auth });
  try {
    const response = yield gmail.users.threads.trash({
      userId: USER,
      id: req.params.id
    });
    if (response && response.data) {
      return response.data;
    }
    return new Error("No message found...");
  } catch (err) {
    throw Error(`Single message return an error: ${err}`);
  }
});
var thrashSingleMessage = (req, res) => __async(void 0, null, function* () {
  try {
    const auth = yield authenticated(req.headers.authorization);
    const response = yield thrashMessage(auth, req);
    return res.status(200).json(response);
  } catch (err) {
    res.status(401).json(err);
  }
});

// src/controllers/Message/deleteSingleMessage.ts
var import_googleapis13 = require("./node_modules/googleapis/build/src/index.js");
var deleteMessage = (auth, req) => __async(void 0, null, function* () {
  const gmail = import_googleapis13.google.gmail({ version: "v1", auth });
  const {
    body: { id }
  } = req;
  try {
    const response = yield gmail.users.threads.delete({
      userId: USER,
      id
    });
    return response;
  } catch (err) {
    throw Error("Message not removed...");
  }
});
var deleteSingleMessage = (req, res) => __async(void 0, null, function* () {
  try {
    const auth = yield authenticated(req.headers.authorization);
    const response = yield deleteMessage(auth, req);
    return res.status(200).json(response);
  } catch (err) {
    res.status(401).json(err);
  }
});

// src/controllers/Message/fetchMessageAttachment.ts
var import_googleapis14 = require("./node_modules/googleapis/build/src/index.js");
var getAttachment = (auth, req) => __async(void 0, null, function* () {
  const gmail = import_googleapis14.google.gmail({ version: "v1", auth });
  const { messageId } = req.params;
  const attachmentId = req.params.id;
  try {
    const response = yield gmail.users.messages.attachments.get({
      userId: USER,
      messageId,
      id: attachmentId
    });
    if (response && response.data) {
      return response.data;
    }
    return new Error("Message attachment not found...");
  } catch (err) {
    throw Error(`Get Attachment returned an error: ${err}`);
  }
});
var fetchMessageAttachment = (req, res) => __async(void 0, null, function* () {
  try {
    const auth = yield authenticated(req.headers.authorization);
    const response = yield getAttachment(auth, req);
    return res.status(200).json(response);
  } catch (err) {
    res.status(401).json(err);
  }
});

// src/controllers/Message/sendMessage.ts
var import_googleapis15 = require("./node_modules/googleapis/build/src/index.js");
var exportMessage = (auth, req) => __async(void 0, null, function* () {
  const gmail = import_googleapis15.google.gmail({ version: "v1", auth });
  const { id, threadId } = req.body;
  try {
    const response = yield gmail.users.messages.send({
      userId: USER,
      requestBody: {
        raw: messageEncoding_default(req.body),
        id,
        threadId
      }
    });
    if (response) {
      return response;
    }
    return new Error("Mail was not sent...");
  } catch (err) {
    throw Error(`Mail was not sent...: ${err}`);
  }
});
var sendMessage = (req, res) => __async(void 0, null, function* () {
  try {
    const auth = yield authenticated(req.headers.authorization);
    const response = yield exportMessage(auth, req);
    return res.status(200).json(response);
  } catch (err) {
    res.status(401).json(err);
  }
});

// src/controllers/Labels/createLabels.ts
var import_googleapis16 = require("./node_modules/googleapis/build/src/index.js");
var newLabels = (auth, req) => __async(void 0, null, function* () {
  const gmail = import_googleapis16.google.gmail({ version: "v1", auth });
  try {
    const {
      body: { labelListVisibility, messageListVisibility, name }
    } = req;
    const response = gmail.users.labels.create({
      userId: USER,
      requestBody: {
        labelListVisibility,
        messageListVisibility,
        name
      }
    });
    return response;
  } catch (err) {
    throw Error(`Create labels returned an error: ${err}`);
  }
});
var createLabels = (req, res) => __async(void 0, null, function* () {
  try {
    const auth = yield authenticated(req.headers.authorization);
    const response = yield newLabels(auth, req);
    return res.status(200).json(response);
  } catch (err) {
    res.status(401).json(err);
  }
});

// src/controllers/Labels/fetchLabels.ts
var import_googleapis17 = require("./node_modules/googleapis/build/src/index.js");
var getLabels = (auth) => __async(void 0, null, function* () {
  const gmail = import_googleapis17.google.gmail({ version: "v1", auth });
  try {
    const response = yield gmail.users.labels.list({
      userId: USER
    });
    if (response && response.data) {
      return response.data;
    }
    return new Error("No Labels found...");
  } catch (err) {
    throw Error(`Labels returned an error: ${err}`);
  }
});
var fetchLabels = (req, res) => __async(void 0, null, function* () {
  try {
    const auth = yield authenticated(req.headers.authorization);
    const response = yield getLabels(auth);
    return res.status(200).json(response);
  } catch (err) {
    res.status(401).json(err);
  }
});

// src/controllers/Labels/fetchSingleLabel.ts
var import_googleapis18 = require("./node_modules/googleapis/build/src/index.js");
var getLabel = (auth, req) => __async(void 0, null, function* () {
  const gmail = import_googleapis18.google.gmail({ version: "v1", auth });
  const { id } = req.params;
  try {
    const response = yield gmail.users.labels.get({
      userId: USER,
      id
    });
    if (response && response.data) {
      return response.data;
    }
    return new Error("No Label found...");
  } catch (err) {
    throw Error(`Label returned an error: ${err}`);
  }
});
var fetchSingleLabel = (req, res) => __async(void 0, null, function* () {
  try {
    const auth = yield authenticated(req.headers.authorization);
    const response = yield getLabel(auth, req);
    return res.status(200).json(response);
  } catch (err) {
    res.status(401).json(err);
  }
});

// src/controllers/Labels/updateLabels.ts
var import_googleapis19 = require("./node_modules/googleapis/build/src/index.js");
var refreshLabels = (auth, req) => __async(void 0, null, function* () {
  const gmail = import_googleapis19.google.gmail({ version: "v1", auth });
  const {
    body: { id, requestBody }
  } = req;
  try {
    const response = yield gmail.users.labels.patch({
      userId: USER,
      id,
      requestBody
    });
    if (response && response.data) {
      return response.data;
    }
    return new Error("No labels created...");
  } catch (err) {
    throw new Error(`Create labels returned an error: ${err}`);
  }
});
var updateLabels = (req, res) => __async(void 0, null, function* () {
  try {
    const auth = yield authenticated(req.headers.authorization);
    const response = yield refreshLabels(auth, req);
    return res.status(200).json(response);
  } catch (err) {
    res.status(401).json(err);
  }
});

// src/controllers/Labels/removeLabels.ts
var import_googleapis20 = require("./node_modules/googleapis/build/src/index.js");
var removeTheLabels = (auth, req) => __async(void 0, null, function* () {
  const gmail = import_googleapis20.google.gmail({ version: "v1", auth });
  const {
    body: { id }
  } = req;
  try {
    const response = yield gmail.users.labels.delete({
      userId: USER,
      id
    });
    return response;
  } catch (err) {
    throw Error(`Create labels returned an error: ${err}`);
  }
});
var removeLabels = (req, res) => __async(void 0, null, function* () {
  try {
    const auth = yield authenticated(req.headers.authorization);
    const response = yield removeTheLabels(auth, req);
    return res.status(200).json(response);
  } catch (err) {
    res.status(401).json(err);
  }
});

// src/controllers/Users/getProfile.ts
var import_googleapis21 = require("./node_modules/googleapis/build/src/index.js");
var fetchProfile = (auth) => __async(void 0, null, function* () {
  const gmail = import_googleapis21.google.gmail({ version: "v1", auth });
  try {
    const response = yield gmail.users.getProfile({
      userId: USER
    });
    if (response && response.status === 200) {
      return response.data;
    }
    return new Error("No Profile found...");
  } catch (err) {
    throw Error(`Profile returned an error: ${err}`);
  }
});
var getProfile = (req, res) => __async(void 0, null, function* () {
  try {
    const auth = yield authenticated(req.headers.authorization);
    const response = yield fetchProfile(auth);
    return res.status(200).json(response);
  } catch (err) {
    res.status(401).json(err);
  }
});

// src/controllers/Contacts/fetchAllContacts.ts
var import_googleapis22 = require("./node_modules/googleapis/build/src/index.js");
var getContacts = (auth, req) => __async(void 0, null, function* () {
  const people = import_googleapis22.google.people({ version: "v1", auth });
  const requestBody = {};
  requestBody.pageSize = typeof Number(req.query.pageSize) !== "number" ? 1e3 : Number(req.query.pageSize);
  if (req.query.readMask) {
    requestBody.readMask = req.query.readMask;
  }
  if (req.query.pageToken) {
    requestBody.pageToken = req.query.pageToken;
  }
  try {
    const response = yield people.otherContacts.list(requestBody);
    if (response && response.data) {
      return response.data;
    }
    return new Error("No contacts found...");
  } catch (err) {
    throw Error(`Contacts returned an error: ${err}`);
  }
});
var fetchAllContacts = (req, res) => __async(void 0, null, function* () {
  try {
    const auth = yield authenticated(req.headers.authorization);
    const response = yield getContacts(auth, req);
    return res.status(200).json(response);
  } catch (err) {
    res.status(401).json(err);
  }
});

// src/controllers/Contacts/queryContacts.ts
var import_googleapis23 = require("./node_modules/googleapis/build/src/index.js");
var getContacts2 = (auth, req) => __async(void 0, null, function* () {
  const people = import_googleapis23.google.people({ version: "v1", auth });
  const requestBody = {};
  requestBody.query = req.query.query;
  requestBody.readMask = req.query.readMask;
  try {
    const response = yield people.otherContacts.search(requestBody);
    if (response && response.data) {
      return response.data;
    }
    return new Error("No contacts found...");
  } catch (err) {
    throw Error(`Contacts returned an error: ${err}`);
  }
});
var queryContacts = (req, res) => __async(void 0, null, function* () {
  try {
    const auth = yield authenticated(req.headers.authorization);
    const response = yield getContacts2(auth, req);
    return res.status(200).json(response);
  } catch (err) {
    res.status(401).json(err);
  }
});

// src/routes/index.ts
var router = import_express.default.Router();
router.get("/api/contacts/:pageSize?/:readMask/:sources?/:pageToken?", fetchAllContacts);
router.get("/api/contact/search/:query?/:readMask?", queryContacts);
router.get("/api/threads_full/:labelIds?/:maxResults?/:nextPageToken?", fetchFullThreads);
router.get("/api/threads/:labelIds?/:maxResults?/:nextPageToken?", fetchThreads);
router.get("/api/thread/:id?", fetchSingleThread);
router.post("/api/create-draft", createDraft);
router.get("/api/drafts/:maxResults?/:nextPageToken?", fetchDrafts);
router.get("/api/draft/:id?", fetchSingleDraft);
router.delete("/api/draft/", deleteDraft);
router.post("/api/send-draft", sendDraft);
router.put("/api/update-draft/?:id?", updateDraft);
router.patch("/api/message/:id?", updateSingleMessage);
router.post("/api/message/thrash/:id?", thrashSingleMessage);
router.delete("/api/message/", deleteSingleMessage);
router.get("/api/message/attachment/:messageId?/:id?", fetchMessageAttachment);
router.post("/api/send-message", sendMessage);
router.post("/api/labels", createLabels);
router.get("/api/labels", fetchLabels);
router.get("/api/label/:id?", fetchSingleLabel);
router.patch("/api/labels", updateLabels);
router.delete("/api/labels", removeLabels);
router.get("/api/user", getProfile);
var routes_default = router;

// src/routes/app.ts
var app = (0, import_express2.default)();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, sentry-trace");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});
app.use(import_express2.default.json());
app.use("/", routes_default);
var swaggerDefinition = {
  info: {
    title: "Juno API",
    version: "0.0.1",
    description: "This is a REST API application made with Express. It retrieves data from Gmail Api.",
    license: {
      name: "Licensed under GNU General Public License v3.0",
      url: "https://github.com/Elysium-Labs-EU/juno-backend/blob/main/LICENSE"
    },
    contact: {
      name: "Robbert Tuerlings",
      url: "https://robberttuerlings.online"
    }
  }
};
var swaggerOptions = {
  swaggerDefinition,
  apis: ["./index.js", "./doc/definitions.yaml"]
};
var swaggerDocs = (0, import_swagger_jsdoc.default)(swaggerOptions);
app.use("/api-docs", import_swagger_ui_express.default.serve, import_swagger_ui_express.default.setup(swaggerDocs));
var app_default = app;

// src/server.ts
var PORT = process.env.PORT || 5001;
var server = import_http.default.createServer(app_default);
server.listen(PORT);
