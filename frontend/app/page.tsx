import "./landing.css";

export default function Home() {
  return (
    <div className="landing-container">
      <nav className="navbar">
        <div className="logo">RippleTrace</div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="https://github.com">GitHub</a>
        </div>
      </nav>

      <header className="hero">
        <h1>Trace the Ripple.<br />Predict the Impact.</h1>
        <p>
          RippleTrace uses AI-powered GraphRAG to visualize global supply chain dependencies 
          and predict how localized events disrupt the world's markets.
        </p>
        <div className="cta-group">
          <a href="/dashboard" className="btn btn-primary">Launch App</a>
          <a href="#features" className="btn btn-secondary">Learn More</a>
        </div>
      </header>

      <section id="features" className="features">
        <div className="feature-card">
          <div className="feature-icon">🌐</div>
          <h3>Graph Intelligence</h3>
          <p>
            Powered by Neo4j, our graph database maps thousands of relationships between 
            companies, regions, and facilities.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🤖</div>
          <h3>Dual-AI Strategy</h3>
          <p>
            Gemini 3 Flash handles rapid data extraction, while Gemini 3.1 Pro 
            provides deep reasoning for risk advisory.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Real-time Alerts</h3>
          <p>
            Stay ahead of disruptions with automated ingestion of global news events 
            and immediate impact analysis.
          </p>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2026 RippleTrace. Powered by GraphRAG and Gemini AI.</p>
      </footer>
    </div>
  );
}
