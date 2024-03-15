import React from 'react'

const Spinner = ({ size = 6, className }: { size?: number; className?: string }) => {
  return (
    <div
      className={`${className} inline-block h-${size} w-${size} animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`}
      role='status'
    >
      <span className='!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]'></span>
    </div>
  )
}

export default Spinner
