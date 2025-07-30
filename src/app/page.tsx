import styles from "@/styles/Home.module.scss";
import { ExternalLink } from "@/lib/components/ExternalLink";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { CopiableCodeBlock } from "@/lib/components/CopiableCodeBlock";

export const metadata: Metadata = {
  title: "Jizha",
  description: "Jijiji",
  icons: "/favicon.ico",
};

const buildCurlCmdStr = (base: string) =>
  'curl "' +
  base +
  '/api/tgproxy/v1/sendMessage" \\' +
  "\n  " +
  '-H "Authorization: Bearer ${token}" \\' +
  "\n  " +
  '-H "Content-Type: application/json" \\' +
  "\n  " +
  '-d \'{"text": "hello"}\'';

export default async function Page() {
  const h = await headers();
  const base = "https://" + h.get("host");

  return (
    <div className={styles.container}>
      <h1>Hey, welcome!</h1>
      <p>
        This is just a simple service that provides API and Telegram bot for you
        to send notification to yourself easily.
      </p>

      <p>
        Go ahead send <code>/token</code> to{" "}
        <ExternalLink href="https://t.me/jizha_bot">Jizha bot</ExternalLink>, it
        should reply you a token. Now you can send yourself a message by calling
        the API like this:
      </p>

      <CopiableCodeBlock cnt={buildCurlCmdStr(base)} />

      <p>
        It&apos;s highly recommended that you deploy your instance of this
        service for youself. The code is available{" "}
        <ExternalLink href="https://github.com/haishanh/next-telegram">
          here
        </ExternalLink>
        .
      </p>
    </div>
  );
}
