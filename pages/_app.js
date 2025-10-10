import "../styles/globals.css";
import {
  StarknetProvider,
  getInstalledInjectedConnectors,
} from "@starknet-react/core";

function MyApp({ Component, pageProps }) {
  const connectors = getInstalledInjectedConnectors();
  return (
    <StarknetProvider connectors={connectors}>
      <>
        <Component {...pageProps} />
        <footer className="site_footer_notice">
          Eykar is no longer actively developed. See what’s next at{" "}
          <a
            href="https://thomas.md/"
            target="_blank"
            rel="noopener noreferrer"
          >
            thomas.md
          </a>
          .
        </footer>
      </>
    </StarknetProvider>
  );
}

export default MyApp;
