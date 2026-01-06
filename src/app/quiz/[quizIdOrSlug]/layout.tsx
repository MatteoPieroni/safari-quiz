import { ViewTransition } from 'react';

import styles from './layout.module.css';

export default function CategoryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className={styles.main}>
        <ViewTransition>{children}</ViewTransition>
      </main>
    </>
  );
}
