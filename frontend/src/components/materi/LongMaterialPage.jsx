import { ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";

import Footer from "../layout/Footer";

function LongMaterialPage({ title, items }) {
  return (
    <>

      <main className="vertex-long-material-page">
        <header className="vertex-long-material-header">
          <h1>Lebih Mengenal Lebih Jauh</h1>
          <h2>{title}</h2>
        </header>

        <section className="vertex-long-material-list">
          {items.map((item, index) => {
            const reverse = index % 2 === 1;
            const color = index % 2 === 0 ? "blue" : "pink";

            return (
              <article
                key={item.id}
                id={item.id}
                className={`vertex-long-material-item ${
                  reverse ? "vertex-long-material-item-reverse" : ""
                }`}
              >
                <div className="vertex-long-material-visual">
                  <h3>
                    <span>{index + 1}.</span> {item.name}
                  </h3>

                  <div className="vertex-long-material-image-wrapper">
                    <img
                      src={item.image}
                      alt={`Bangun ruang ${item.name}`}
                      className="vertex-long-material-image"
                    />
                  </div>
                </div>

                <div
                  className={`vertex-long-material-card vertex-long-material-card-${color}`}
                >
                  <p className="vertex-long-material-description">
                    <strong>{item.name}</strong> {item.description}
                  </p>

                  {item.extra && (
                    <p className="vertex-long-material-extra">{item.extra}</p>
                  )}

                  <div className="vertex-long-material-formulas">
                    {item.formulas.map((formula) => (
                      <p key={formula.label}>
                        <strong>{formula.label}</strong> = {formula.value}
                      </p>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <section className="vertex-long-material-practice">
          <div className="vertex-long-material-practice-icon" aria-hidden="true">
            <ClipboardList size={112} strokeWidth={1.55} />
          </div>

          <Link to="/latihan" className="vertex-long-material-practice-button">
            Yuk Latihan!
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default LongMaterialPage;
