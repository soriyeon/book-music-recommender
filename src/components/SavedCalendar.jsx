import '../styles/Calendar.css';
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { loadSavedRecommendations } from '../utils/storage';

const formatLabels = {
  '소설': '📖 소설',
  '비문학/에세이': '📘 비문학/에세이',
  '교재/공부용': '📚 교재/공부용',
  '만화/웹툰': '📕 만화/웹툰'
};

const purposeLabels = {
  '감정 이입, 힐링용': '🌙 감정 이입/힐링',
  '로맨스/서사': '💕 두근두근 로맨스/서사',
  '추리/분석': '👻 오싹한 미스터리/추리',
  '공부/요약/암기': '🍀 공부/요약/암기',
  '자기이해/자기계발': '💬 자기이해/자기계발'
};

function SavedCalendar() {
  const [saved, setSaved] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [noteEntry, setNoteEntry] = useState(null);
  const [noteText, setNoteText] = useState('');
  const modalRef = useRef(null);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const data = loadSavedRecommendations();
    setSaved(data);
  }, []);

  useEffect(() => {
    const handleUpdate = () => {
      const data = loadSavedRecommendations();
      setSaved(data);
      if (selectedDate) {
        const matches = data.filter((entry) => entry.date === selectedDate);
        setSelectedEntries(matches);
      }
    };

    window.addEventListener('recommendationSaved', handleUpdate);
    return () => window.removeEventListener('recommendationSaved', handleUpdate);
  }, [selectedDate]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (date) => {
    const clickedDate = formatDate(date);
    if (selectedDate === clickedDate) {
      setSelectedDate(null);
      setSelectedEntries([]);
    } else {
      setSelectedDate(clickedDate);
      const matches = saved.filter((entry) => entry.date === clickedDate);
      setSelectedEntries(matches);
    }
  };

  const openNoteModal = (entry) => {
    setNoteEntry(entry);
    setNoteText(entry.note || '');
  };

  useLayoutEffect(() => {
    if (noteEntry && modalRef.current) {
      const modal = modalRef.current;
      modal.style.left = '10px';
      modal.style.top = '310px';
    }
  }, [noteEntry]);

  const saveNote = () => {
    const updated = saved.map((e) =>
      e.id === noteEntry.id ? { ...e, note: noteText } : e
    );
    localStorage.setItem('savedRecommendations', JSON.stringify(updated));
    setSaved(updated);
    setSelectedEntries(updated.filter((e) => e.date === noteEntry.date));
    //setNoteEntry(null);
    //setNoteText('');
  };

  const startDrag = (e) => {
    const modal = modalRef.current;
    offset.current = {
      x: e.clientX - modal.offsetLeft,
      y: e.clientY - modal.offsetTop,
    };
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
  };

  const onDrag = (e) => {
    const modal = modalRef.current;
    modal.style.left = `${e.clientX - offset.current.x}px`;
    modal.style.top = `${e.clientY - offset.current.y}px`;
  };

  const stopDrag = () => {
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const d = formatDate(date);
      const matched = saved.find((entry) => entry.date === d);
      return matched ? <div className="text-pink-400 text-xs text-center">✏️</div> : null;
    }
  };

  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return;

    const classes = [];
    const day = date.getDay();
    if (day === 0) classes.push('sunday');
    if (day === 6) classes.push('saturday');

    const dateStr = formatDate(date);
    if (selectedDate === dateStr) classes.push('selected-date');
    if (dateStr === formatDate(new Date())) classes.push('today-date');

    return classes;
  };

  return (
    <div className="w-full max-w-[700px]" style={{ fontFamily: "'Pretendard', sans-serif" }}>
      <h2 className="text-lg font-bold mt-28 mb-1 ml-3" style={{ color: '#595775' }}>📅 기록소</h2>

      <div className="relative flex items-start">
        <div className="w-[280px] z-10">
          <Calendar
            onChange={handleDateChange}
            value={selectedDate ? new Date(selectedDate) : null}
            tileContent={tileContent}
            tileClassName={tileClassName}
            showNeighboringMonth={false}
          />
        </div>

        {selectedEntries.length > 0 && (
          <div className="absolute left-[-304px] w-[300px] style={{ top: '-24px' }}
                          p-4 bg-pink-50 border border-pink-200 rounded-lg
                          text-left z-0 space-y-4 max-h-[500px] overflow-y-auto scroll-area">
            {selectedEntries.map((entry, index) => (
              <div key={entry.id}
                className={`relative bg-pink-50 rounded-md px-1 pt-3 pb-3 ${index !== 0 ? 'border-t border-pink-300 border-dashed' : ''}`}>

                <button
                  onClick={() => openNoteModal(entry)}
                  className="absolute top-6 right-[42px] bg-pink-100 text-pink-700 text-xs font-bold px-2 py-1 rounded shadow"
                >📝</button>

                <button
                  onClick={() => {
                    const updated = saved.filter((s) => s.id !== entry.id);
                    localStorage.setItem("savedRecommendations", JSON.stringify(updated));
                    setSaved(updated);
                    setSelectedEntries(updated.filter((e) => e.date === entry.date));
                  }}
                  className="absolute top-6 right-0 bg-red-100 hover:bg-red-200 text-red-600 text-xs font-bold px-2 py-1 rounded shadow"
                >🗑️</button>

                <p className="text-sm mb-1">{formatLabels[entry.format] || entry.format}</p>
                <p className="text-sm mb-2">{purposeLabels[entry.purpose] || entry.purpose}</p>
                <div>
                  <iframe
                    width="260"
                    height="146"
                    src={`https://www.youtube.com/embed/${entry.videoId}`}
                    title="추천 영상"
                    frameBorder="0"
                    allowFullScreen
                    className="mx-auto"
                  ></iframe>
                </div>
              </div>
            ))}
          </div>
        )}

        {noteEntry && (
          <div className="fixed z-50">
            <div
              ref={modalRef}
              className="bg-white rounded-lg p-4 w-[300px] shadow-xl absolute"
              style={{ left: '330px', top: '300px' }}
            >
              {/* 우상단 닫기 버튼 */}
              <button
                onClick={() => setNoteEntry(null)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-base leading-none p-1 rounded-full bg-transparent"
                title="닫기"
              >
                ✕
              </button>

              {/* 드래그 핸들 */}
              <div
                className="cursor-move text-lg font-semibold mb-2 select-none flex items-center"
                onMouseDown={startDrag}
              >
                memo
              </div>

              <textarea
                className="w-full h-40 p-2 border rounded resize-none text-sm"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              ></textarea>

              <div className="flex justify-end mt-3">
                <button
                  onClick={saveNote}
                  className="bg-pink-300 hover:bg-pink-400 text-white px-3 py-1 rounded"
                >
                  save
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default SavedCalendar;
