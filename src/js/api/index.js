import fetch from 'isomorphic-fetch'
import request from 'superagent'
import { serverApi } from '../app';
import { makePath } from '../utils';

function _fetch(...args) {
  let isCanceled = false;
  const promise = new Promise((resolve, reject) => {
    fetch(...args)
      .then(res => {
        if (isCanceled)
          reject({ isCanceled });
        else if (res.status >= 200 && res.status < 300) {
          return res.json()
            .then(data => { 
              return { data, status: res.status }
            })
            .catch(reason => {
              return { status: res.status }
            });
        } else {
          throw { message: res.statusText, status: res.status };
        }
      })
      .then(result => {
        isCanceled ? reject({ isCanceled }) : resolve(result);
      })
      .catch(reason => {
        console.log("Fetch Error: " + reason.message);
        isCanceled ? 
          reject({ isCanceled }) : reject({ message: reason.message });
      });
  });
  return { 
    promise,
    p: promise,
    cancel() {
      isCanceled = true;
    } 
  };
}

function _request(req) {
  if (!req)
    return null;
  
  let rej;
  let isCanceled = false;
  const promise = new Promise((resolve, reject) => {
    if (isCanceled)
      reject({ isCanceled });
    else {
      rej = reject;
      req.end((err, res) => {
        if (err)
          reject({ message: err.message, status: err.status });
        else
          resolve({ data: res.body, status: res.status });
      });  
    }  
  });
  
  return { 
    promise,
    p: promise,
    cancel() {
      if (!isCanceled) {
        isCanceled = true;
        req.abort();
        if (rej) 
          rej({ isCanceled });  
      }
    } 
  };
}

export function fetchAllDatabases() {
  const path = makePath('_all_dbs');
  return _fetch(serverApi(path));
}

export function fetchDatabase(db) {
  const path = makePath(db);
  return _fetch(serverApi(path));
}

export function fetchDocs(db, pageSize, page, startkey) {
  const query = { 
    access: true, channels: true, include_docs: true, 
    limit: (pageSize + 1), startkey
  };
  const path = makePath(db, '_all_docs', query);
  return _fetch(serverApi(path))
}

export function fetchDoc(db, docId) {
  const query = { revs: true };
  const path = makePath(db, docId, query);
  return _fetch(serverApi(path));
}

export function fetchRevision(db, docId, revId) {
  const query = { revs: true, rev: revId };
  const path = makePath(db, docId, query);
  return _fetch(serverApi(path));
}

export function createDoc(db, json) {
  const path = makePath(db, '');
  return _fetch(serverApi(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(json)
  });
}

export function updateRevision(db, docId, revId, json) {
  const query = { rev: revId };
  const path = makePath(db, docId, query);
  const body = Object.assign({ }, json, { _id: undefined, _rev: undefined });
  return _fetch(serverApi(path), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}

export function uploadAttachment(db, docId, revId, file) {
  const query = { rev: revId };
  const path = makePath(db, docId, file.name, query);
  return _fetch(serverApi(path), {
    method: 'PUT',
    body: file
  });
}

export function deleteDoc(db, docId, revId) {
  const query = { rev: revId };
  const path = makePath(db, docId, query);
  return _fetch(serverApi(path), {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });
}

export function fetchChangesFeed(db, params) {
  const path = makePath(db, '_changes');
  const req = request.post(serverApi(path))
    .set('Content-Type', 'application/json')
    .send(params);
  return _request(req);
}

export function _fetchChangesFeed(db, params) {
  const path = makePath(db, '_changes');
  return _fetch(serverApi(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
}

export function fetchUsers(db) {
  const path = makePath(db, '_user');
  return _fetch(serverApi(path));
}

export function fetchUser(db, user) {
  const path = makePath(db, '_user', user);
  return _fetch(serverApi(path));
}

export function createUser(db, info) {
  const path = makePath(db, '_user', '');
  return _fetch(serverApi(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(info)
  });
}

export function updateUser(db, user, info) {
  const path = makePath(db, '_user', user);
  return _fetch(serverApi(path), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(info)
  });
}

export function deleteUser(db, user) {
  const path = makePath(db, '_user', user);
  return _fetch(serverApi(path), {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });
}
