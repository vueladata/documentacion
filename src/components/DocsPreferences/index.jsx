import React from 'react';
import {translate} from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useColorMode, useHistorySelector} from '@docusaurus/theme-common';
import {useAlternatePageUtils} from '@docusaurus/theme-common/internal';
import IconDarkMode from '@theme/Icon/DarkMode';
import IconLightMode from '@theme/Icon/LightMode';
import IconLanguage from '@theme/Icon/Language';
import styles from './styles.module.css';

export default function DocsPreferences() {
  const {colorMode, setColorMode} = useColorMode();
  const {i18n: {currentLocale}} = useDocusaurusContext();
  const search = useHistorySelector(({location}) => location.search);
  const hash = useHistorySelector(({location}) => location.hash);
  const {createUrl} = useAlternatePageUtils();

  const isDark = colorMode === 'dark';
  const isEnglish = currentLocale === 'en';
  const otherLocale = isEnglish ? 'es' : 'en';
  const otherUrl = createUrl({locale: otherLocale, fullyQualified: false});
  const ModeIcon = isDark ? IconDarkMode : IconLightMode;
  const light = translate({id: 'docs.preferences.light', message: 'Light'});
  const dark = translate({id: 'docs.preferences.dark', message: 'Dark'});
  const themeLabel = isDark
    ? translate({id: 'docs.preferences.useLight', message: 'Switch to light mode'})
    : translate({id: 'docs.preferences.useDark', message: 'Switch to dark mode'});
  const languageLabel = translate({
    id: 'docs.preferences.switchLanguage',
    message: 'Read this page in Spanish',
  });

  return (
    <div className={styles.controls}>
      <button
        className={styles.control}
        type="button"
        onClick={() => setColorMode(isDark ? 'light' : 'dark')}
        aria-label={`${isDark ? dark : light}. ${themeLabel}`}
        title={themeLabel}>
        <ModeIcon aria-hidden="true" />
        {isDark ? dark : light}
      </button>
      <a
        className={styles.control}
        href={`${otherUrl}${search}${hash}`}
        hrefLang={otherLocale}
        aria-label={`EN / ES. ${languageLabel}`}
        title={languageLabel}>
        <IconLanguage aria-hidden="true" />
        <span aria-hidden="true">
          <span className={isEnglish ? styles.currentLanguage : undefined}>EN</span>
          <span className={styles.separator}>/</span>
          <span className={isEnglish ? undefined : styles.currentLanguage}>ES</span>
        </span>
      </a>
    </div>
  );
}
