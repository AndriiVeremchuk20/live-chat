import AppUser from "@/types/user.type";
import TooltipItem from "./TooltipItem";

interface propTooltip {
  users: AppUser[];
  onClick: () => void;
}

const Tooltip: React.FC<propTooltip> = ({ users, onClick }) => {
  return (
    <div
      className="mt-5 divide-y divide-slate-900 rounded-xl bg-neutral-200"
      onClick={onClick}
    >
      {users.map((user, index) => (
        <TooltipItem user={user} key={index} />
      ))}
    </div>
  );
};

export default Tooltip;
