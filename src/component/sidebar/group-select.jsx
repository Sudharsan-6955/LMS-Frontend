import Select from 'react-select';

const GroupSelect = ({
  onFilterChange,
  filters,
  categoryOptions = [],
  languageOptions = [],
  skillOptions = [],
  priceOptions = [],
}) => {
  const customStyles = {
    container: (base) => ({ ...base, width: '100%', marginBottom: '1rem' }),
  };

  const prependAllOption = (options, allLabel) => [
    { value: 'all', label: allLabel },
    ...options.map(value => {
      const strVal = String(value);
      return {
        value: strVal,
        label: typeof value === 'number'
          ? (value === 0 ? 'Free' : `₹${value}`)
          : strVal
      };
    }),
  ];

  const getSelectedOption = (options, value, allLabel) => {
    const strVal = String(value);
    if (strVal === 'all') {
      return { value: 'all', label: allLabel };
    }
    const matched = options.find(opt => String(opt) === strVal);
    return {
      value: strVal,
      label:
        typeof matched === 'number'
          ? (matched === 0 ? 'Free' : `₹${matched}`)
          : strVal,
    };
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-3">
          <Select
            styles={customStyles}
            options={prependAllOption(categoryOptions, 'All Categories')}
            value={getSelectedOption(categoryOptions, filters.category, 'All Categories')}
            onChange={selected => onFilterChange('category', selected.value)}
          />
        </div>
        <div className="col-md-3">
          <Select
            styles={customStyles}
            options={prependAllOption(languageOptions, 'All Languages')}
            value={getSelectedOption(languageOptions, filters.language, 'All Languages')}
            onChange={selected => onFilterChange('language', selected.value)}
          />
        </div>
        <div className="col-md-3">
          <Select
            styles={customStyles}
            options={prependAllOption(skillOptions, 'All Skills')}
            value={getSelectedOption(skillOptions, filters.skill, 'All Skills')}
            onChange={selected => onFilterChange('skill', selected.value)}
          />
        </div>
        <div className="col-md-3">
          <Select
            styles={customStyles}
            options={prependAllOption(priceOptions, 'All Prices')}
            value={getSelectedOption(priceOptions, filters.price, 'All Prices')}
            onChange={selected => onFilterChange('price', selected.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default GroupSelect;
