
const ErrorMessage = ({children} : {children: React.ReactNode}) => {
  return (
    <div className="text-center my-4 bg-red-50 text-red-400 font-bold p-3 uppercase text-sm">
        {children}
    </div>
  )
}

export default ErrorMessage