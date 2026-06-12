import { v4 } from "uuid";
import crypto from "crypto";

export function uuid () {
   return v4();
}

export function hashPwd (pwd: string) {
   return crypto.createHash('sha1').update(pwd).digest('hex');
}