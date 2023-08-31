import AppUser from "@/types/user.type";
import TooltipItem from "./TooltipItem";

interface propTooltip {
  users: AppUser[];
}

const Tooltip: React.FC<propTooltip> = ({ users }) => {
  return (
    <div className="divide-y divide-slate-900 bg-neutral-200 rounded-xl mt-5">
	  {users.map((user, index) => (
        <TooltipItem user={user} key={index} />
      ))}
    </div>
  );
};

export default Tooltip;
