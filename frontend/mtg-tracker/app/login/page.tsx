export default function LoginPage() {
  return (
    <div className="bg-amber-800 grow flex flex-col min-h-screen">
      <div className="grid grid-cols-2 grow">
        <div className="bg-blue-100 flex flex-col">
          {/* Todo: Add Something cool here */}
          Box 1
        </div>
        <div className="bg-green-200 flex flex-col justify-center">
          <div className="flex justify-center">

            {/* Login/Signup Form */}
            <div className="p-12 border border-solid rounded-md w-full mx-12">
              <form action="">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome Back</h2>
                <div className="flex flex-col">
                  <input className="border my-1 p-1" type="text" placeholder="Email" />                
                  <input className="border my-1 p-1" type="text" placeholder="Password" />                
                </div>
              </form>
              <div>- OR -</div>
              <button className="border p-2 my-1">
                Continue With Google
              </button>
              <hr className="border-t border-black my-4" />
              <div>Don't have an account? <a className="text-blue-800 font-semibold">Sign Up</a></div>
            </div>


          </div>
        </div>
      </div>
    </div>
  )
}