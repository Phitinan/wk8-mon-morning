import { Link } from "react-router-dom";
const Navbar = ({isAuthenticated, setIsAuthenticated}) => {
  const handleClick = (e) => {
    localStorage.removeItem("user")
    setIsAuthenticated(false)
  };


  return (
    <nav className="navbar">
      <Link to="/">
        <h1>Our Properties</h1>
      </Link>
      <div className="links" >
        {isAuthenticated &&
        <div>
          <Link to="/add-property">Add Property</Link>
          <button onClick={handleClick}>Log out</button>
          <span>{JSON.parse(localStorage.getItem("user")).email}</span>
        </div>}
        {!isAuthenticated && 
        <div>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </div>}
      </div>
    </nav>
  );
}

export default Navbar;