export default function CustomInputField({name, type, placeholder, value, onChange}) {
  return (
    <div className="flex flex-col my-1 leading-7">
      <label htmlFor={name}>{name}</label>
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="border py-1 px-1 rounded"
      />
    </div>
  );
}
