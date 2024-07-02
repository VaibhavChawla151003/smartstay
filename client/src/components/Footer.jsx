import "./FooterStyles.css";
import { FaFacebookSquare, FaInstagramSquare, FaBehanceSquare, FaTwitterSquare } from 'react-icons/fa';

const Footer = () => {
  return (
    <div className="footer">
      <div className="top">
        <div>
          <h1>Smart Stay</h1>
          <p>Choose your favourite place to stay</p>
        </div>
        <div>
          <a href="/">
            <FaFacebookSquare size={30} color="#4267B2" />
          </a>
          <a href="/">
            <FaInstagramSquare size={30} color="#E1306C" />
          </a>
          <a href="/">
            <FaBehanceSquare size={30} color="#1769FF" />
          </a>
          <a href="/">
            <FaTwitterSquare size={30} color="#1DA1F2" />
          </a>
        </div>
      </div>
      <div className="bottom">
        <div>
          <h4>Project</h4>
          <a href="/">Changelog</a>
          <a href="/">Status</a>
          <a href="/">License</a>
          <a href="/">All Versions</a>
        </div>
        <div>
          <h4>Community</h4>
          <a href="/">GitHub</a>
          <a href="/">Issues</a>
          <a href="/">Project</a>
          <a href="/">Twitter</a>
        </div>
        <div>
          <h4>Help</h4>
          <a href="/">Support</a>
          <a href="/">Troubleshooting</a>
          <a href="/">Contact Us</a>
        </div>
        <div>
          <h4>Others</h4>
          <a href="/">Terms of Service</a>
          <a href="/">Privacy Policy</a>
          <a href="/">License</a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
