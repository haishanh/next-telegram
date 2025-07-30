import * as jose from "jose";
import { config } from "@/lib/config";
import { SeqHandlerInput } from "@/lib/utils/common.util";
import assert from "node:assert";

export type Jwt = {
  sign(d: string | object | Buffer): Promise<string>;
  verify(d: string): Promise<any>;
};

function sign(payload: any, secret: string): Promise<string> {
  const alg = "HS256";
  return (
    new jose.SignJWT(payload)
      .setProtectedHeader({ alg })
      .setIssuedAt()
      // .setExpirationTime('2h')
      .sign(new TextEncoder().encode(secret))
  );
}

async function verify(token: string, secret: string) {
  const { payload } = await jose.jwtVerify(
    token,
    new TextEncoder().encode(secret),
  );
  return payload;
}

export function setup(input: SeqHandlerInput<{ jwt?: Jwt }>) {
  // should haven't initialized
  assert(!input.ctx.jwt, "Expect jwt in ctx");

  input.ctx.jwt = {
    sign: (d: string | object | Buffer) => sign(d, config.jwtSecret),
    verify: (d: string) => verify(d, config.jwtSecret),
  };
}
