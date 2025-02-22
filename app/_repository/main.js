import { log } from 'node:console';
import crypto from 'node:crypto';

function hashPassword(salt, password) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

function verifyPassword(salt, hashed, password) {
  return hashPassword(salt, password) === hashed;
}

console.log(crypto.randomBytes(16).toString('hex'));
