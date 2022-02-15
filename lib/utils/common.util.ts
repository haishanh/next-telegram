import type { MaybePromise } from "@lib/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { HttpException } from "@lib/error";

export type SeqHandlerInput<Ctx = unknown> = {
  req: NextApiRequest;
  res: NextApiResponse;
  ctx: Ctx;
};

type IsHandled = boolean;

type SeqHandler<Ctx extends any> = (input: SeqHandlerInput<Ctx>) => MaybePromise<IsHandled | void>;

export function seq<Ctx>(...fns: SeqHandler<Ctx>[]) {
  return async (input: SeqHandlerInput<Ctx>) => {
    for (let fn of fns) {
      try {
        const isHandled = await fn(input);
        if (isHandled) return;
      } catch (e) {
        if (e instanceof HttpException) {
          input.res.status(e.statusCode).json({ message: e.message, code: e.code });
          return;
        } else {
          throw e;
        }
      }
    }
  };
}
