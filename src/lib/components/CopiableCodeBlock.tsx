"use client";

import * as React from "react";
import { CopyButton } from "@/lib/components/CopyButton";
import s from "./CopiableCodeBlock.module.scss";

export function CopiableCodeBlock({ cnt }: { cnt: string }) {
  return (
    <div className={s.CopiableExample}>
      <pre className={s.pre}>
        <code>{cnt}</code>
      </pre>
      <span className={s.copyBtn}>
        <CopyButton provideContent={() => cnt} />
      </span>
    </div>
  );
}
