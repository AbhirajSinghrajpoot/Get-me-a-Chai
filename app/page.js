"use client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleStartNow = () => {
    if (session?.user?.username) {
      router.push(`/${session.user.username}`)
    } else {
      router.push("/login")
    }
  }

  return (
    <>
      <div className="flex justify-center flex-col items-center text-white h-[44vh]">
        <div className="font-bold text-5xl flex justify-center items-center">Buy Me a Chai <span><img className="invertImg" src="/tea.gif" width={88} alt="" /></span></div>
        <p>
          A crowdfunding platform for Creators. Get funded by your fans and followers. Start now!
        </p>
        <div>
          <button
            onClick={handleStartNow}
            type="button"
            className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Start Now
          </button>
          <a
            href="https://wizards-portfolio.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              type="button"
              className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Read More
            </button>
          </a>
        </div>
      </div>
      <div className='bg-amber-50 h-1 opacity-10'>
      </div>

      <div className="text-white container mx-auto py-32">
        <h2 className="text-3xl font-bold text-center mb-14">Your Fans can buy you a Chai</h2>
        <div className="flex gap-5 justify-around">
          <div className="item space-y-3 flex flex-col justify-center items-center">
            <img className="  bg-slate-400 rounded-full p-2 text-black" width={88} src="/man.gif" alt="" />
            <p className="font-bold">Fans want to help</p>
            <p className=" text-center">Your Fans are available for you to help you</p>
          </div>
          <div className="item space-y-3 flex flex-col justify-center items-center">
            <img className="  bg-slate-400 rounded-full p-2 text-black" width={88} src="/coin.gif" alt="" />
            <p className="font-bold">Fans want to help</p>
            <p className=" text-center">Your Fans are available for you to help you</p>
          </div>
          <div className="item space-y-3 flex flex-col justify-center items-center">
            <img className="  bg-slate-400 rounded-full p-2 text-black" width={88} src="/group.gif" alt="" />
            <p className="font-bold">Fans want to help</p>
            <p className=" text-center">Your Fans are available for you to help you</p>
          </div>
        </div>
      </div>
      <div className='bg-amber-50 h-1 opacity-10'>
      </div>
      <div className="text-white container mx-auto py-32 pt-14 flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-center mb-14">Learn more about us</h2>
      </div>
    </>
  );
}

