export default function Navbar() {
  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href=".">
          <img
            src="assets/cards/AS.svg"
            width="24"
            height="32"
            alt="Solitario"
          />
          Solitario
        </a>
      </div>

      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-start">
          <button className=" button is-primary">Nuevo Juego</button>
        </div>
      </div>
    </nav>
  );
}
