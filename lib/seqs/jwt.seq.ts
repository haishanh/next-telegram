import jwt from "jsonwebtoken";
import { config } from "@lib/config";
import { SeqHandlerInput } from "@lib/utils/common.util";
import util from "util";

const sign = util.promisify(jwt.sign);

interface Jwt {
  sign(d: string | object | Buffer): Promise<unknown>;
  verify(d: string): Promise<any>;
}

export function setup(input: SeqHandlerInput<{ jwt?: Jwt }>) {
  input.ctx.jwt = {
    sign: (d: string | object | Buffer) => sign(d, config.jwtSecret),
    verify: (d: string) => {
      // workaround ts typign issue when using util.promisify
      return new Promise((resolve, reject) => {
        jwt.verify(d, config.jwtSecret, (e, d) => {
          if (e) return reject(e);
          return resolve(d);
        });
      });
    },
  };
}
