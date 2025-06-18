import SurveyForm from './components/SurveyForm';
import ribbon from './assets/ribbon.png';
import rabbit from './assets/rabbit.png';
import tworabbits from './assets/tworabbits.png';
import movingheart from './assets/movingheart.gif';

function App() {
  return (
    <div className="min-h-screen w-full bg-yellow-100 text-gray-900 flex flex-col items-center relative overflow-x-hidden">
      <h1 className="text-2xl font-bold p-6 text-center">
        ✨나만의 책플리! 🧸완벽한 하루 만들기♥️
      </h1>

      {/* 설문 폼과 하트 이미지 */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full px-4">
        <img src={movingheart} alt="movingheart" className="hidden sm:h-20 md:h-28 lg:h-36 xl:h-40 md:block self-end" />

        <div className="w-full max-w-xl">
          <SurveyForm />
        </div>

        <img src={movingheart} alt="movingheart" className="hidden sm:h-20 md:h-28 lg:h-36 xl:h-40 md:block self-end" />
      </div>


      {/* 오른쪽 상단 리본 */}
      <img
        src={ribbon}
        alt="ribbon"
        className="w-30 h-30 fixed top-24 right-12 z-10 pointer-events-none"
      />

      {/* 오른쪽 하단 토끼 */}
      <img
        src={rabbit}
        alt="rabbit-fixed"
        className="w-64 h-64 fixed -bottom-10 right-12 z-10 pointer-events-none"
      />

      {/* 왼쪽 하단 두 마리 토끼 */}
      <img
        src={tworabbits}
        alt="two-rabbits-fixed"
        className="w-64 h-64 fixed -bottom-12 left-12 z-10 pointer-events-none"
      />
    </div>
  );
}


export default App;
