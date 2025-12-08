import { ColorModeProvider, ColorModeScript, cookieStorageManagerSSR } from "@kobalte/core";
import { Link, Meta, MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { isServer } from "solid-js/web";
import { getCookie } from "vinxi/http";
import "./app.css";

function getServerCookies() {
  "use server"
  const colorMode = getCookie("kb-color-mode")
  return colorMode ? `kb-color-mode=${colorMode}` : ""
}

export default function App() {
  const storageManager = cookieStorageManagerSSR(isServer ? getServerCookies() : document.cookie)
  return (
    <Router
      root={props => (
        <>
          <MetaProvider>
            <Title>Dshbloks</Title>
            <Meta name="description" content="Dshbloks - Information in a dash" />
            <Link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <Link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <Link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <Link rel="manifest" href="/site.webmanifest" />
            <ColorModeScript storageType={storageManager.type} />
            <ColorModeProvider storageManager={storageManager}>
              <Suspense>{props.children}</Suspense>
            </ColorModeProvider>
          </MetaProvider>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
