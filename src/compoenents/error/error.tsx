

const Error = () => {
  return (
    <div className="flex flex-column itemsstart justifystart gap-32px bg-[#ffffff]">
        <div className="h-48px w-48px rounded-16px bg-[#DBDEE5]">
            <img src="/receipt_long.svg" alt="receipt" className='h-24px w-24pc' />
        </div>
        
        <div className="w-[369px] ">
        <h1 className="text-[28px] text-[#131316] font-bold 700, leading-40px">No matching transaction found for the selected filter</h1>
        <p className="text-[16px] text-[#56616B] font-500 medium, leading-24px">Change your filters to see more result, or add a new product</p>
        </div>

        <button className="w-[117px] px-24px py-12px rounded-100% bg-[#EFF1F6]">Clear filter</button>
      
    </div>
  )
}

export default Error
