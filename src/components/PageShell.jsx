import SiteHeader from "./SiteHeader.jsx";
import SiteFooter from "./SiteFooter.jsx";

export default function PageShell({ children, transparentHeader = false }) {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className={transparentHeader ? "" : "pt-20"}>{children}</main>
      <SiteFooter />
    </div>
  );
}
