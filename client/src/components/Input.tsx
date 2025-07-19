interface InputProps {
  type: string;
  placeholder: string;
  input: string;
}

const Input: React.FC<InputProps> = ({ input, ...InputProps }) => {
  const generalClass =
    "rounded-4xl border border-gray-800 focus:outline-none text-black px-5 py-3 text-xl";
  return (
    <>
      {input === "textarea" && <textarea className={generalClass}></textarea>}
      {input === "select" && (
        <select className={generalClass} name="" id="">
          <option  value="" className="text-gray-500" disabled>Scegli la tipologia</option>
          <option value="">Primo</option>
          <option value="">Secondo</option>
          <option value="">Dessert</option>
        </select>
      )}
      {input === "input" && <input {...InputProps} className={generalClass} />}
    </>
  );
};
export default Input;
