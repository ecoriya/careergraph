import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:3001";

function App() {
  const [user, setUser] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadRecommendations = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/recommendations/u1`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data = await response.json();

      setRecommendations(data.recommendations || []);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to connect to CareerGraph. Please make sure the server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setUser({
      name: "Supriya",
      skills: ["Java", "SQL", "Git", "Spring Boot"],
    });

    loadRecommendations();
  }, []);

  return (
    <div className="app">

      {/* Navigation */}

      <nav className="navbar">
        <div className="logo">
          Career<span>Graph</span>
        </div>

        <div className="nav-links">
          <a href="#jobs">Jobs</a>
          <a href="#skills">Skills</a>
          <a href="#about">How it works</a>
        </div>
      </nav>


      {/* Hero */}

      <main>

        <section className="hero">

          <div className="hero-content">

            <div className="badge">
              Graph-powered job discovery
            </div>

            <h1>
              Find jobs that connect
              <span> with your skills.</span>
            </h1>

            <p>
              CareerGraph uses relationships between your skills,
              related skills, and job requirements to discover
              opportunities that traditional keyword search can miss.
            </p>

          </div>

        </section>


        {/* Profile */}

        <section className="profile-section" id="skills">

          <div className="section-heading">
            <div>
              <p className="eyebrow">YOUR PROFILE</p>
              <h2>Your career graph</h2>
            </div>
          </div>

          {user && (
            <div className="profile-card">

              <div className="profile-avatar">
                {user.name.charAt(0)}
              </div>

              <div className="profile-info">

                <h3>{user.name}</h3>

                <p>
                  Skills connected to your profile
                </p>

                <div className="skills">

                  {user.skills.map((skill) => (
                    <span
                      className="skill"
                      key={skill}
                    >
                      {skill}
                    </span>
                  ))}

                </div>

              </div>

            </div>
          )}

        </section>


        {/* Recommendations */}

        <section className="jobs-section" id="jobs">

          <div className="section-heading">

            <div>
              <p className="eyebrow">GRAPH MATCHES</p>

              <h2>Recommended jobs</h2>

              <p className="section-description">
                Opportunities discovered through your skill
                relationships.
              </p>
            </div>

            {!loading && !error && (
              <div className="result-count">
                {recommendations.length} matches
              </div>
            )}

          </div>


          {/* Loading */}

          {loading && (
            <div className="state-card">
              <div className="loader"></div>

              <p>
                Exploring your career graph...
              </p>
            </div>
          )}


          {/* Error */}

          {!loading && error && (
            <div className="state-card error-state">

              <div className="state-icon">
                !
              </div>

              <h3>Connection problem</h3>

              <p>{error}</p>

              <button
                onClick={loadRecommendations}
                className="primary-button"
              >
                Try again
              </button>

            </div>
          )}


          {/* Empty */}

          {!loading &&
            !error &&
            recommendations.length === 0 && (
              <div className="state-card">

                <div className="state-icon">
                  ?
                </div>

                <h3>No recommendations yet</h3>

                <p>
                  We couldn't find jobs connected to your
                  current skills.
                </p>

              </div>
            )}


          {/* Jobs */}

          {!loading &&
            !error &&
            recommendations.length > 0 && (

              <div className="jobs-grid">

                {recommendations.map((job) => (

                  <article
                    className="job-card"
                    key={job.id}
                  >

                    <div className="job-top">

                      <div className="company-icon">
                        {job.title.charAt(0)}
                      </div>

                      {job.remote && (
                        <span className="remote">
                          Remote
                        </span>
                      )}

                    </div>

                    <h3>{job.title}</h3>

                    <p className="location">
                      📍 {job.location}
                    </p>

                    <div className="job-details">

                      <span>
                        ₹ {job.salary}
                      </span>

                      <span>
                        Match: {job.matchedSkill}
                      </span>

                    </div>

                    <button className="view-button">
                      View opportunity
                    </button>

                  </article>

                ))}

              </div>

            )}

        </section>


        {/* How it works */}

        <section className="how-section" id="about">

          <div className="section-heading centered">

            <p className="eyebrow">
              WHY GRAPH?
            </p>

            <h2>
              Connections create better matches.
            </h2>

            <p>
              CareerGraph doesn't only look for exact keyword
              matches. It follows relationships in the graph.
            </p>

          </div>


          <div className="graph-flow">

            <div className="flow-card">
              <strong>Your skill</strong>
              <span>Java</span>
            </div>

            <div className="arrow">
              →
            </div>

            <div className="flow-card">
              <strong>Related skill</strong>
              <span>Spring Boot</span>
            </div>

            <div className="arrow">
              →
            </div>

            <div className="flow-card">
              <strong>Opportunity</strong>
              <span>Backend Developer</span>
            </div>

          </div>

        </section>

      </main>


      {/* Footer */}

      <footer>

        <div className="logo">
          Career<span>Graph</span>
        </div>

        <p>
          Graph-powered career discovery.
        </p>

      </footer>

    </div>
  );
}

export default App;