import type { MaybePromise } from "@/lib/types";
import { type NextRequest } from "next/server";
import { HttpException } from "@/lib/error";

export type SeqHandlerInput<Ctx = unknown> = {
  req: NextRequest;
  ctx: Ctx;
};

type SeqHandler<Ctx> = (
  input: SeqHandlerInput<Ctx>,
) => MaybePromise<Response | void>;

export function seq<Ctx>(...fns: SeqHandler<Ctx>[]) {
  return async (input: SeqHandlerInput<Ctx>) => {
    for (const fn of fns) {
      try {
        const res = await fn(input);
        if (res instanceof Response) return res;
      } catch (e) {
        if (e instanceof HttpException) {
          const body = JSON.stringify({ message: e.message, code: e.code });
          return new Response(body, { status: e.statusCode });
        } else {
          throw e;
        }
      }
    }
  };
}

export async function wrapRoute(fn: () => MaybePromise<Response>) {
  try {
    const res = await fn();
    if (res instanceof Response) {
      return res;
    } else if (!res) {
      // treat res as a JSON serializable object
      return Response.json(res);
    } else {
      return new Response(null, { status: 204 });
    }
  } catch (e) {
    if (e instanceof Response) {
      return e;
    } else if (e instanceof HttpException) {
      const body = JSON.stringify({ message: e.message, code: e.code });
      return new Response(body, { status: e.statusCode });
    } else {
      throw e;
    }
  }
}
