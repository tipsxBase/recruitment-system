import { JobStatus } from "@recruitment/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const JobStatusSelect = ({
  value,
  onChange,
  placeholder = "请选择",
  className,
}: {
  value: JobStatus;
  onChange: (value: JobStatus) => void;
  placeholder: string;
  className?: string;
}) => {
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="active">启用</SelectItem>
        <SelectItem value="inactive">禁用</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default JobStatusSelect;
