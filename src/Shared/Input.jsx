const Input = ({ type, value, labelFor, placehold }) => {
  return (
    <div className="flexCol gap-3 w-full">
      <p className="text-white w-full font-semibold flex  justify-start items-start">{labelFor}</p>
      <input
        className="w-full p-4 rounded-md outline-none"
        type={type}
        value={value}
        name=""
        id=""
        placeholder={placehold}
      />
    </div>
  );
};

export default Input;