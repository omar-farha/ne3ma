"use clinet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BriefcaseMedical, Package, Utensils } from "lucide-react";

function FilterSection({
  setAmountCount,
  setConditionCount,
  setSurplusTypeCount,
}) {
  return (
    <div className="py-2 px-3 flex grid-cols-3  md:flex gap-2">
      <Select
        onValueChange={(value) =>
          value == "All"
            ? setSurplusTypeCount(null)
            : setSurplusTypeCount(value)
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">
            <h2 className="flex gap-2">All</h2>
          </SelectItem>
          <SelectItem value="food">
            <h2 className="flex gap-2">
              <Utensils className="h-4 w-4 text-primary" /> Food
            </h2>
          </SelectItem>
          <SelectItem value="medican">
            <h2 className="flex gap-2 ">
              <BriefcaseMedical className="h-4 w-4 text-primary" /> Medicen
            </h2>
          </SelectItem>
          <SelectItem value="tools">
            <h2 className="flex gap-2">
              <Package className="h-4 w-4 text-primary" /> Tools
            </h2>
          </SelectItem>
        </SelectContent>
      </Select>
      <Select onValueChange={setConditionCount}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Condition" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="new">
            <h2 className="flex gap-2">New</h2>
          </SelectItem>
          <SelectItem value="used">
            <h2 className="flex gap-2 ">Used</h2>
          </SelectItem>
          <SelectItem value="tools">
            <h2 className="flex gap-2">Needs Repair</h2>
          </SelectItem>
        </SelectContent>
      </Select>
      <Select onValueChange={setAmountCount}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Amount of Items" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">
            <h2 className="flex gap-2">1</h2>
          </SelectItem>
          <SelectItem value="used">
            <h2 className="flex gap-2 ">2</h2>
          </SelectItem>
          <SelectItem value="3">
            <h2 className="flex gap-2">3</h2>
          </SelectItem>
          {/* <SelectItem value="more">
            <h2 className="flex gap-2">More</h2>
          </SelectItem> */}
        </SelectContent>
      </Select>
    </div>
  );
}
export default FilterSection;
