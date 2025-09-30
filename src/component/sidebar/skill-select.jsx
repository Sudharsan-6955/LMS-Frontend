import Select from "react-select";

const options = [
  { value: "all", label: "All" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const SkillSelect = ({ value, onChange }) => {
  const handleChange = (selectedOption) => {
    onChange("skill", selectedOption.value);
  };

  return (
    <div className="filter-box">
      <label>Skill</label>
      <Select
        options={options}
        defaultValue={options.find(o => o.value === value)}
        onChange={handleChange}
      />
    </div>
  );
};

export default SkillSelect;
