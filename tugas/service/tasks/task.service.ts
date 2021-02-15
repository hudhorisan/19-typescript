import * as Busboy from 'busboy';
import * as url from 'url';
import * as mime from 'mime-types';
import { Writable } from 'stream';
import {
  add,
  cancel,
  done,
  list,
  ERROR_TASK_DATA_INVALID,
  ERROR_TASK_NOT_FOUND,
  DataTask
} from './task';
import { saveFile, readFile, ERROR_FILE_NOT_FOUND } from '../lib/storage';
import {IncomingMessage,ServerResponse} from 'http'

export function addSvc(req:IncomingMessage, res:ServerResponse) {
  console.log("masuk sini")
  const busboy = new Busboy({ headers: req.headers });

  let data:DataTask = {
    job: '',
    assigneeId: 0,
    attachment: '',
  };

  let finished = false;
  
  function abort() {
    req.unpipe(busboy);
    if (!req.aborted) {
      res.statusCode = 500;
      res.write('internal server error');
      res.end();
    }
  }

  busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
    console.log(fieldname,mimetype,file)
    switch (fieldname) {
      case 'attachment':
        try {
          data.attachment = await saveFile(file, mimetype);
        } catch (err) {
          abort();
        }
        if (!req.aborted && finished) {
          try {
            const task = await add(data);
            res.setHeader('content-type', 'application/json');
            res.write(JSON.stringify(task));
          } catch (err) {
            if (err === ERROR_TASK_DATA_INVALID) {
              res.statusCode = 401;
            } else {
              res.statusCode = 500;
            }
            res.write(err);
          }
          res.end();
        }
        break;
      default: {
        const noop = new Writable({
          write(chunk, encding, callback) {
            setImmediate(callback);
          },
        });
        file.pipe(noop);
      }
    }
  });

  busboy.on('field', (fieldname, val) => {
    switch (fieldname) {
      case 'job':
        data.job = val;
        break;
      case 'assignee_id':
        data.assigneeId = parseInt(val, 10);
        break;
    }
  });

  busboy.on('finish', async () => {
    finished = true;
  });

  req.on('aborted', abort);
  busboy.on('error', abort);

  req.pipe(busboy);
}

export async function listSvc(req:IncomingMessage, res:ServerResponse) {
  try {
    const tasks = await list();
    res.setHeader('content-type', 'application/json');
    res.write(JSON.stringify(tasks));
    res.end();
  } catch (err) {
    res.statusCode = 500;
    res.end();
    return;
  }
}

export async function doneSvc(req:IncomingMessage, res:ServerResponse) {
  const uri:url.UrlWithParsedQuery = url.parse(req.url!, true);
  const id = uri.query['id'];
  if (!id) {
    res.statusCode = 401;
    res.write('parameter id tidak ditemukan');
    res.end();
    return;
  }
  try {
    if(typeof id === 'string'){
      const idnum = parseInt(id)
      const task = await done(idnum);
      res.setHeader('content-type', 'application/json');
      res.statusCode = 200;
      res.write(JSON.stringify(task));
      res.end();
    }
    
  } catch (err) {
    if (err === ERROR_TASK_NOT_FOUND) {
      res.statusCode = 404;
      res.write(err);
      res.end();
      return;
    }
    res.statusCode = 500;
    res.end();
    return;
  }
}

export async function cancelSvc(req:IncomingMessage, res:ServerResponse) {
  const uri:url.UrlWithParsedQuery = url.parse(req.url!, true);
  const id = uri.query['id'];
  if (!id) {
    res.statusCode = 401;
    res.write('parameter id tidak ditemukan');
    res.end();
    return;
  }
  try {
    if(typeof id === 'string'){
      const idnum = parseInt(id)
      const task = await cancel(idnum);
      res.setHeader('content-type', 'application/json');
      res.statusCode = 200;
      res.write(JSON.stringify(task));
      res.end();
    }
    
  } catch (err) {
    if (err === ERROR_TASK_NOT_FOUND) {
      res.statusCode = 404;
      res.write(err);
      res.end();
      return;
    }
    res.statusCode = 500;
    res.end();
    return;
  }
}

export async function getAttachmentSvc(req:IncomingMessage, res:ServerResponse) {
  const uri:url.UrlWithParsedQuery = url.parse(req.url!, true);
  const objectName = uri.pathname!.replace('/attachment/', '');
  if (!objectName) {
    res.statusCode = 400;
    res.write('request tidak sesuai');
    res.end();
  }
  try {
    const objectRead = await readFile(objectName);
    let mimeContent = mime.lookup(objectName)
    if(typeof mimeContent === 'string'){
      res.setHeader('Content-Type', mimeContent);
      res.statusCode = 200;
      objectRead.pipe(res);
    }
    
  } catch (err) {
    if (err === ERROR_FILE_NOT_FOUND) {
      res.statusCode = 404;
      res.write(err);
      res.end();
      return;
    }
    res.statusCode = 500;
    res.write('gagal membaca file');
    res.end();
    return;
  }
}

