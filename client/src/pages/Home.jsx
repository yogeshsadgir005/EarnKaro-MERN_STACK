import Navbar from '../components/Navbar';
import { useEffect, useState, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from '../utils/axios';

export default function Home() {
  const [sliderTasks, setSliderTasks] = useState([]);
  const [featuredTasks, setFeaturedTasks] = useState([]);
  const [sliderIndex, setSliderIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sliderRes, featuredRes] = await Promise.all([
          axios.get('/tasks/slider-tasks'),
          axios.get('/tasks'),
        ]);
        setSliderTasks(sliderRes.data);
        setFeaturedTasks(featuredRes.data);
      } catch (e) {
        console.error('Error fetching tasks:', e?.response?.data?.message || e.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, [sliderTasks]);

  const startAutoSlide = () => {
    stopAutoSlide();
    intervalRef.current = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % sliderTasks.length);
    }, 5000);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const goPrev = () => {
    stopAutoSlide();
    setSliderIndex((prev) => (prev - 1 + sliderTasks.length) % sliderTasks.length);
    startAutoSlide();
  };

  const goNext = () => {
    stopAutoSlide();
    setSliderIndex((prev) => (prev + 1) % sliderTasks.length);
    startAutoSlide();
  };

  return (
    <>
      <Navbar />
      <div className="bg-yellow-300 text-black text-center p-2 font-semibold text-sm">
        Join a platform where students & graduates build skills, land gigs, and earn real rewards
      </div>

      <main className="bg-black text-white min-h-screen px-4 py-6 space-y-12">
        {/* Hero Slider */}
        <section className="relative w-full max-w-4xl mx-auto h-56 sm:h-60 md:h-72 overflow-hidden rounded-xl shadow-lg">
          {sliderTasks.length > 0 ? (
            <div className="relative w-full h-full">
              {sliderTasks.map((task, i) => (
                <div
                  key={i}
                  className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                    i === sliderIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <img
                    src={task.banner}
                    alt={task.title}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/70 p-3 rounded-lg max-w-[90%] sm:max-w-sm">
                    <h3 className="font-bold text-lg">{task.title}</h3>
                    <p className="text-xs text-gray-300">{task.description}</p>
                  </div>
                </div>
              ))}

              <button
                onClick={goPrev}
                className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/60 p-2 rounded-full z-20"
              >
                <FaChevronLeft className="text-white text-sm sm:text-base" />
              </button>
              <button
                onClick={goNext}
                className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/60 p-2 rounded-full z-20"
              >
                <FaChevronRight className="text-white text-sm sm:text-base" />
              </button>
            </div>
          ) : (
            <p className="text-center text-gray-400">Loading slider...</p>
          )}
        </section>

<section>
  <h2 className="text-xl sm:text-2xl font-bold mb-4">⭐ Featured Tasks</h2>

  {/* 🔹 Mobile: Horizontal scroll with compact cards */}
  <div className="block sm:hidden overflow-x-auto pb-2">
    <div className="flex space-x-3">
      {featuredTasks.length === 0 ? (
        <p className="text-gray-400">No featured tasks available.</p>
      ) : (
        featuredTasks.map((t) => (
          <div
            key={t._id}
            className="w-[130px] bg-gray-900 rounded-md p-2 flex-shrink-0 shadow-sm text-xs"
          >
            {t.banner && (
              <img
                src={t.banner}
                alt={t.title}
                className="w-full h-16 object-cover rounded mb-1"
              />
            )}
            <div className="mb-1">
              <h4 className="font-bold text-[11px] leading-tight line-clamp-1">{t.title}</h4>
              <p className="text-[10px] text-gray-400 line-clamp-2">{t.description}</p>
            </div>
            <div className="mt-1">
              <p className="text-blue-400 font-semibold text-[11px] mb-1">₹{t.reward}</p>
              <a
                href={t.link}
                target="_blank"
                rel="noreferrer"
                className="block bg-blue-600 hover:bg-blue-700 text-white text-center py-1 rounded text-[10px]"
              >
                Do
              </a>
            </div>
          </div>
        ))
      )}
    </div>
  </div>

  {/* 🔹 Tablet & Desktop: Full-sized grid */}
  <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
    {featuredTasks.length === 0 ? (
      <p className="col-span-full text-gray-400">No featured tasks available.</p>
    ) : (
      featuredTasks.map((t) => (
        <div
          key={t._id}
          className="bg-gray-900 rounded-lg p-4 shadow-md hover:shadow-lg transition flex flex-col justify-between"
        >
          {t.banner && (
            <img
              src={t.banner}
              alt={t.title}
              className="w-full h-36 object-cover rounded mb-3"
            />
          )}
          <div className="mb-2">
            <h4 className="font-bold text-lg mb-1">{t.title}</h4>
            <p className="text-sm text-gray-300">{t.description}</p>
          </div>
          <div className="mt-4">
            <p className="text-blue-400 font-semibold mb-2">Earn ₹{t.reward}</p>
            <a
              href={t.link}
              target="_blank"
              rel="noreferrer"
              className="block bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded text-sm"
            >
              Do Task
            </a>
          </div>
        </div>
      ))
    )}
  </div>
</section>


        {/* Updates & Streaks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-3">🆕 Latest Updates</h2>
            <ul className="text-gray-300 space-y-2 text-sm list-disc list-inside">
              <li>Referral bonus increased to ₹100</li>
              <li>Monthly leaderboard now live</li>
              <li>New survey and app install tasks added</li>
            </ul>
          </section>

          <section className="bg-gray-900 rounded-lg p-6 flex flex-col justify-between">
            <h2 className="text-lg sm:text-xl font-bold mb-3">🔥 Your Streak</h2>
            <div>
              <p className="text-gray-400 text-sm">You've maintained your streak for:</p>
              <p className="text-3xl font-extrabold text-yellow-400">4 Days</p>
            </div>
            <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold text-sm">
              Claim Daily Bonus
            </button>
          </section>
        </div>
      </main>
    </>
  );
}