import { Link } from "react-router-dom";
import PageShell from "../components/PageShell.jsx";

export default function NotFound() {
  return (
    <PageShell>
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="eyebrow justify-center">Error 404</div>
          <h1 className="mt-4 font-serif text-navy">Page not found</h1>
          <p className="mt-4 text-sm text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
          <Link to="/" className="mt-8 inline-flex items-center justify-center rounded-sm bg-navy px-6 py-3 text-sm font-medium text-ivory hover:bg-navy/90">Return home</Link>
        </div>
      </div>
    </PageShell>
  );
}
