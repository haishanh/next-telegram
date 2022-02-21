import * as React from "react";
import { ExternalLink as Icon } from "react-feather";
import s from "./ExternalLink.module.scss";

export function ExternalLink(props: { href: string; children: React.ReactNode }) {
  return (
    <a href={props.href} className={s.a} target="_blank" rel="noopener noreferrer">
      {props.children}
      <Icon size={16} />
    </a>
  );
}
