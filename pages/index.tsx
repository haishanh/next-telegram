import type { GetServerSideProps } from "next";
import Head from "next/head";
import styles from "@styles/Home.module.scss";
import { CopiableCodeBlock } from "@lib/components/CopiableCodeBlock";
import { ExternalLink } from "@lib/components/ExternalLink";

const x = (base: string) =>
  'curl "' +
  base +
  '/api/tgproxy/v1/sendMessage" \\' +
  "\n  " +
  '-H "Authorization:Bearer ${jwt}" \\' +
  "\n  " +
  '-H "Content-Type: application/json" \\' +
  "\n  " +
  '-d \'{"text": "hello"}\'';

const Home = (props: { base: string }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Jizha</title>
        <meta name="description" content="Jijiji" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Hey, welcome!</h1>
      <p>
        This is just a simple service that provides API and Telegram bot for you to send
        notification to yourself easily.
      </p>

      <p>
        Go ahead send <code>/token</code> to{" "}
        <ExternalLink href="https://t.me/jizha_bot">Jizha bot</ExternalLink>, it should reply you a
        token. Now you can send yourself a message by calling the API like this:
      </p>

      <CopiableCodeBlock cnt={x(props.base)} />

      <p>
        It&apos;s highly recommended that you deploy your instance of this service for youself. The
        code is available{" "}
        <ExternalLink href="https://github.com/haishanh/next-telegram">here</ExternalLink>.
      </p>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  let base = "https://" + ctx.req.headers.host;
  return {
    props: { base },
  };
};
