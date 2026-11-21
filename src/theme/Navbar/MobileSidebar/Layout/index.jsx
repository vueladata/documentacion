import React from 'react';
import {useLocation} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import OriginalLayout from '@theme-original/Navbar/MobileSidebar/Layout';
import DocsPreferences from '@site/src/components/DocsPreferences';
import styles from './styles.module.css';

function MenuWithPreferences({children}) {
  return (
    <div className={styles.panel}>
      <div className={styles.menu}>{children}</div>
      <DocsPreferences />
    </div>
  );
}

export default function MobileSidebarLayout(props) {
  const {pathname} = useLocation();
  const docsPath = useBaseUrl('/docs').replace(/\/$/, '');

  if (pathname !== docsPath && !pathname.startsWith(`${docsPath}/`)) {
    return <OriginalLayout {...props} />;
  }

  return (
    <OriginalLayout
      {...props}
      primaryMenu={<MenuWithPreferences>{props.primaryMenu}</MenuWithPreferences>}
      secondaryMenu={<MenuWithPreferences>{props.secondaryMenu}</MenuWithPreferences>}
    />
  );
}
