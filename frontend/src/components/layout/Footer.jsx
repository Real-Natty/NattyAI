import { Sparkles } from "lucide-react";

function Footer() {
  return (
    <footer className="page-footer">
      <div className="footer-brand">
        <Sparkles size={15} />

        <strong>NattyAI</strong>

        <span>Bringing imagination to life.</span>
      </div>

      <span>Built for creators with big ideas.</span>

      <div className="copyright-section">
        <p>
          © {new Date().getFullYear()} Natty Group of Companies. All rights
          reserved.
        </p>

        <span>Chibuike Eluagu</span>
      </div>
    </footer>
  );
}

export default Footer;
