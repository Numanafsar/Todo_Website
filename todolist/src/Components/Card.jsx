
export default function Card({bgColor,text,onClick}) {
  return (
    <button className={`${bgColor} sm:w-[150px] sm:h-[80px] w-[100px] h-[50px] rounded-md`} onClick={onClick}>
      {text}
    </button>
  )
}
