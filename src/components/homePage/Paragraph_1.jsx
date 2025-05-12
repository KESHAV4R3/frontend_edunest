
const Paragraph_1 = ({
  data1,
  data2,
  data3 = "",
  container = "false",
  back,
}) => {
  return (
    <div>
      <p
        className={`e
          ${back == "white" ? "text-black" : "text-white"}
          ${
            container == "true"
              ? " text-[27px] tablet:text-[35px]"
              : "text-[32px] tablet:text-[42px]"
          } font-[800] text-center tablet:text-start`}
        style={{ fontFamily: "Fira Code, monospace" }}
      >
        {data1}
        <span className="text-dark_red  ml-2 text-shadow-dark_red">
          {data2}
        </span>{" "}
        {data3}
      </p>
    </div>
  );
};

export default Paragraph_1;
