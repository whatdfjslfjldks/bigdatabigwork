import Head from "next/head";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="zh-cn">
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1" />
        <title>卷烟厂综合效能数据展板</title>
        <link rel="icon" href="./favicon.ico" />
      </Head>
      <body className="bg-indigo-900">{children}</body>
    </html>
  );
}
