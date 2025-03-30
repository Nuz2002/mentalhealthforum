import { Link } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-8 mt-12">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center px-4 gap-6">
        <div className="text-white text-xl font-bold tracking-wide hover:text-teal-400 transition-colors">
          <Link to="/">психологический форум</Link>
        </div>

        <div className="text-center text-blue-100 text-sm italic max-w-md px-4">
          «Ваше психическое здоровье так же важно, как и физическое. Отдыхать — нормально. Просить о помощи — нормально. Исцеление — это не слабость, это сила.»
        </div>

        <div className="flex flex-col items-center md:items-end gap-3 text-sm text-blue-100">
          <div className="flex items-center hover:text-teal-400 transition-colors">
            <FaEnvelope className="text-teal-400 mr-2" />
            <span>support@forum.com</span>
          </div>
          <div className="flex items-center hover:text-teal-400 transition-colors">
            <FaPhone className="text-teal-400 mr-2" />
            <span>+123 456 7890</span>
          </div>
          <div className="flex items-center hover:text-teal-400 transition-colors">
            <FaMapMarkerAlt className="text-teal-400 mr-2" />
            <span>123 ул. Форума, Город Сообщества</span>
          </div>
        </div>
      </div>

      <div className="text-center text-sm mt-8 pt-6 border-t border-blue-700">
        <p className="text-blue-300">
          &copy; {new Date().getFullYear()} психологический форум. Все права защищены.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
