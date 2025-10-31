
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const DateConverterPopover = () => {
  return (
    <Link
      to="/nepad"
      className="flex items-center text-asklegal-heading hover:text-asklegal-purple gap-2 theme-transition"
    >
      <Calendar size={18} />
      <span className="hidden md:inline">NepAD</span>
    </Link>
  );
};

export default DateConverterPopover;
