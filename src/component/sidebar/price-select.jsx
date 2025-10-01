import Select from "react-select";

const priceOptions = [
    { label: "All", value: "all" },
    { label: "Free", value: 0 },
    { label: "$30", value: 30 },
    { label: "$45", value: 45 },
];

const PriceSelect = ({ onFilterChange, filters }) => {
    return (
        <Select
            options={priceOptions}
            defaultValue={priceOptions[0]}
            onChange={(option) => onFilterChange('price', option?.value ?? 'all')}
        />
    );
};

export default PriceSelect;
