import React from 'react';
import {translate} from '@docusaurus/Translate';
import {useLocation} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {useThemeConfig} from '@docusaurus/theme-common';
import FooterCopyright from '@theme/Footer/Copyright';
import FooterLayout from '@theme/Footer/Layout';
import FooterLinks from '@theme/Footer/Links';
import FooterLogo from '@theme/Footer/Logo';

const passengerFooterLinks = [{
  title: 'Proyecto',
  items: [
    {label: 'Inicio', to: '/'},
    {label: 'Documentación técnica', to: '/docs'},
  ],
}];

export default function Footer() {
  const {footer: {style, links, logo}} = useThemeConfig();
  const {pathname} = useLocation();
  const home = useBaseUrl('/');
  const isPassengerHome = pathname === home || pathname === home.slice(0, -1);
  const footerLinks = isPassengerHome ? passengerFooterLinks : links;
  const description = isPassengerHome
    ? 'Prototipo de experiencia de viaje'
    : translate({
        id: 'docs.footer.description',
        message: 'Passenger experience prototype',
      });
  const copyright = `VuelaData · ${new Date().getFullYear()} · ${description}`;

  return (
    <FooterLayout
      style={style}
      links={<FooterLinks links={footerLinks} />}
      logo={logo && <FooterLogo logo={logo} />}
      copyright={<FooterCopyright copyright={copyright} />}
    />
  );
}
