const Footer = () => {
  return (
    <footer>
      <p className="text-center">
        Copyright &copy; <span id="year">{new Date().getFullYear()}</span>{" "}
        <a href="https://github.com/ritatanght" target="__blank">
          Rita Tang
        </a>
        . All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
