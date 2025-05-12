
const Paragraph_2 = ({ data, container = "false", back }) => {
  return (
    <div>
      <p
        className={`${
          back == "white" ? "text-gray-700" : "text-[#b1b1b1]"
        } text-[18px] m-auto max-w-[1200px] ${
          container == "true" ? "w-full" : " w-[90%]"
        } tablet:text-[20px] tracking-wide text-center tablet:text-start`}
      >
        {data}
      </p>
    </div>
  );
};

export default Paragraph_2;
