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
            <div className="p-12 border border-solid">
              <form action="">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome Back</h2>
                <div className="flex flex-col">
                  <input className="border-1 my-1 p-1" type="text" placeholder="Email" />                
                  <input className="border-1 my-1 p-1" type="text" placeholder="Password" />                
                </div>
                <button></button>
              </form>
              <button>
                Continue With Google
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}