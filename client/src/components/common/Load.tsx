import React from 'react'

const Load: React.FC = () => {
    return (
        <div className="mt-16">
            <div className="loader w-[50px] aspect-square grid absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
    )
}
export default Load