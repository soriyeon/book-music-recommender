import SurveyForm from './components/SurveyForm';
import SavedCalendar from './components/SavedCalendar.jsx';
import ribbon from './assets/ribbon.png';
import rabbit from './assets/rabbit.png';
import tworabbits from './assets/tworabbits.png';
import movingheart from './assets/movingheart.gif';

function App() {
  return (
    <div className="min-h-screen w-full bg-yellow-100 text-gray-900 relative overflow-x-hidden">
      {/* 제목 */}
      <h1 className="text-2xl font-bold p-6 text-center">

      </h1>

      {/* 전체 래퍼: grid로 정렬 */}
      <div className="relative max-w-7xl mx-auto px-4">
        {/* 왼쪽 기록소: 절대 위치 */}
        <div className="absolute left-0 top-0">
          <SavedCalendar />
        </div>

        {/* 설문폼: 화면 중앙에 정렬 */}
        <div className="flex flex-col items-center mx-auto w-full max-w-[640px]">
          <img src={movingheart} alt="movingheart" className="hidden md:block h-24 mb-2" />
          <SurveyForm />
          <img src={movingheart} alt="movingheart" className="hidden md:block h-24 mt-2" />
        </div>
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

      {/* 왼쪽 하단 토끼 */}
      <img
        src={tworabbits}
        alt="two-rabbits-fixed"
        className="w-64 h-64 fixed -bottom-12 left-12 z-0 pointer-events-none"
      />
    </div>
  );
}

export default App;
