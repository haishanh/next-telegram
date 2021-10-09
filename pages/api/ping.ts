import type { NextApiRequest, NextApiResponse } from "next";
import { arch, cpus, release, platform, type, totalmem } from "os";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const info = {
    arch: arch(),
    cpus: cpus(),
    release: release(),
    platform: platform(),
    type: type(),
    totalmem: totalmem(),
  };
  return res.json(info);
}
