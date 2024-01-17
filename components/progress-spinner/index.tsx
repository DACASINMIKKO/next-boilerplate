import React from 'react'

const ProgressSpinner = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full border-t-4 border-b-4 border-blue-500 h-16 w-16"></div>
        </div>
    )
}

export default ProgressSpinner