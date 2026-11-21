import React from 'react';
import OriginalContent from '@theme-original/DocSidebar/Desktop/Content';
import DocsPreferences from '@site/src/components/DocsPreferences';

export default function DocSidebarContent(props) {
  return (
    <>
      <OriginalContent {...props} />
      <DocsPreferences />
    </>
  );
}
