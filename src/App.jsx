import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [active, setActive] = useState(null);
  const texts = ["Work", "Short Break", "Long Break"];
  const [show, setShow] = useState(false);
  const [time, setTime] = useState(0);
  const [run, setRun] = useState(false);
  const [customTime, setCustomTime] = useState({ hours: "", minutes: "", seconds: "" });
  const [showtable, setShowtable] = useState(false);
  const audioRef = useRef(null);

  if (audioRef.current) {
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  }

  const Percentage = (time / 1500) * 100; // Adjust according to the selected task duration

  // Ensure the correct time is set when a task is selected
  useEffect(() => {
    if (active === "Work") {
      setTime(1500);
    } else if (active === "Short Break") {
      setTime(300);
    } else if (active === "Long Break") {
      setTime(900);
    }
  }, [active]);

  const start = () => {
    if (run) {
      toast.error("⏳ Timer is already running!");
      return;
    }

    if (!show) {
      toast.error("🚀 First, select a task!");
      return;
    }

    if (time === 0) {
      toast.error("⏰ Time must be more than 0!");
      return;
    }

    setRun(true);
    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          clearInterval(interval);
          setRun(false);
          toast.success("🎉 Time's up!");
          return 0;
        }
      });
    }, 1000);
  };

  // Custom time setting form
  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setCustomTime((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyCustomTime = () => {
    const h = parseInt(customTime.hours) || 0;
    const m = parseInt(customTime.minutes) || 0;
    const s = parseInt(customTime.seconds) || 0;
    const totalSeconds = h * 3600 + m * 60 + s;

    if (totalSeconds === 0) {
      toast.error("⏰ Enter a valid time!");
    } else {
      setTime(totalSeconds);
      setShow(true);
      toast.success("✅ Custom time set successfully!");
    }
  };


  const time_setting = () => {
    setShowtable(!showtable);
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      <audio ref={audioRef} src="./src/assets/tick.mkv" />

      <div className="flex items-center h-screen p-4 bg-gradient-to-r from-[#002147] via-[#002147c5] to-[#003153] text-white flex-col gap-5">
        <h1 className="text-2xl font-bold">Pomodoro Timer</h1>

        {/* Task Selection */}
        <div className="flex gap-4 font-semibold bg-[#002147] px-3 rounded-4xl h-[70px] justify-center items-center">
          {texts.map((text, index) => (
            <span
              key={index}
              onClick={() => {
                setShow(true);
                setActive(text);
              }}
              className={`transition-all duration-500 ease-in-out hover:scale-110 hover:bg-[#0647006b] px-5 py-3 rounded-4xl cursor-pointer ${
                active === text ? "bg-[#0647006b] border-2 border-[#021831]" : ""
              }`}
            >
              {text}
            </span>
          ))}
        </div>

        {/* Timer Display */}
        <div className="bg-[#021831] w-[250px] h-[250px] rounded-full flex justify-center items-center relative p-5">
          <div className="absolute w-[230px] h-[230px] rounded-full overflow-hidden">
            <div className="absolute w-full h-full rounded-full bg-[#ffffff8f] flex justify-center items-center overflow-hidden">
              <div
                className="absolute w-full h-full rounded-full"
                style={{
                  background: `conic-gradient(white 0deg ${Percentage * 3.6}deg, #2f2f2f ${Percentage * 3.6}deg 360deg)`,
                }}
              ></div>
            </div>
          </div>

          <div className="flex flex-col gap-2 bg-[#021831] z-10 w-[220px] h-[220px] rounded-full justify-center items-center">
            {show ? <span className="text-2xl font-bold">{`${Math.floor(time / 60)}:${String(time % 60).padStart(2, "0")}`}</span> : ""}
            <span
              onClick={start}
              className={`text-2xl font-bold cursor-pointer ${run ? "text-[#ffffff71]" : "text-white"}`}
            >
              START
            </span>
          </div>
        </div>

     <div className={`flex flex-col gap-3 bg-[#021831] p-4 rounded-lg relative
          ${showtable ? "block translate-x-0" : "hidden h-0 translate-x-[-100%]"}
          `}>
          <div onClick={time_setting} className="absolute top-4 right-4 cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 hover:rotate-360">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#D9D9D9"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
          </div>
          <h2 className="text-lg font-semibold">Set Custom Time</h2>
          <div className="flex gap-3">
            <input
              type="number"
              name="hours"
              value={customTime.hours}
              onChange={handleTimeChange}
              placeholder="Hours"
              className="w-16 p-2 text-white rounded"
            />
            <input
              type="number"
              name="minutes"
              value={customTime.minutes}
              onChange={handleTimeChange}
              placeholder="Minutes"
              className="w-16 p-2 text-white rounded"
            />
            <input
              type="number"
              name="seconds"
              value={customTime.seconds}
              onChange={handleTimeChange}
              placeholder="Seconds"
              className="w-16 p-2 text-white rounded"
            />
          </div>
          <button onClick={applyCustomTime} className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500">
            Apply Time
          </button>
        </div>
        <div onClick={time_setting} className={`my-5 cursor-pointer transition-all duration-1000 ease-in-out hover:scale-125 hover:rotate-360 group
        
          ${showtable ? "rotate-90 scale-125 absolute opacity-0 bottom-[100%]" : "rotate-0 scale-100 opacity-100 relative"}`

          
        }>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="35px"
            viewBox="0 -960 960 960"
            width="35px"
            fill="#D9D9D9"
          >
            <path
              className="group-hover:fill-white transition-all duration-500 ease-in-out delay-100"
              d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"
            />
          </svg>
        </div>

       

        {/* Owner Credit */}
        <div className="owner">Made by <span className="font-bold">Sabir Hussain Balal...</span></div>
      </div>
    </>
  );
}

export default App;
