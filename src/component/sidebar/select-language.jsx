const LanguageSelect = ({ value, onChange }) => {
  return (
    <select name="language" value={value} onChange={onChange}>
      <option value="all">All Languages</option>
      <option value="English">English</option>
      <option value="French">French</option>
      <option value="Tamil">Tamil</option>
    </select>
  );
};

export default LanguageSelect;
