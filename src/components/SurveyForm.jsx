import { useState, useEffect } from 'react';
import musicRecommendations from '../data/musicRecommendations';

const formatLabels = {
  '소설': '📖소설',
  '비문학/에세이': '📘비문학/에세이',
  '교재/공부용': '📚공부용',
  '만화/웹툰': '📕만화/웹툰'
};

const purposeLabels = {
  '감정 이입, 힐링용': '🌙감정 이입/힐링🌼',
  '로맨스/서사': '💕두근두근 로맨스/서사💗',
  '추리/분석': '💀오싹한 미스터리/추리👻',
  '공부/요약/암기': '🌈공부/요약/암기🍀',
  '자기이해/자기계발': '💭자기이해/자기계발💬'
};

function SurveyForm() {
  const [format, setFormat] = useState('');
  const [purpose, setPurpose] = useState('');
  const [tags, setTags] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false); // ✅ 추가

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    let videoList = [];
    if (format === '교재/공부용') {
      videoList = musicRecommendations[format] || [];
    } else {
      videoList = musicRecommendations[purpose] || [];
    }

    if (videoList.length > 0) {
      const randomIndex = Math.floor(Math.random() * videoList.length);
      const video = videoList[randomIndex];
      setSelectedVideo(video);

      const query = new URLSearchParams({
        format,
        purpose,
        tags: tags.join(','),
        video: video.youtubeId
      }).toString();
      setShareUrl(`${window.location.origin}?${query}`);
    } else {
      setSelectedVideo(null);
      setShareUrl('');
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const f = params.get('format');
    const p = params.get('purpose');
    const t = params.get('tags')?.split(',') || [];
    const v = params.get('video');

    if (f && p && v) {
      setFormat(f);
      setPurpose(p);
      setTags(t);
      setSubmitted(true);
      setSelectedVideo({ youtubeId: v });
    }
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl p-6 space-y-4 flex flex-col items-center text-center"
    >

      <h1 className="text-xl font-bold text-pink-300">
        🤍오늘은 어떤 음악을 들으면서🎧 독서/공부를 할까?🍮🤍
      </h1><br />

      <div className="flex flex-wrap gap-4">
        {Object.entries(formatLabels).map(([value, label]) => (
          <label key={value} className="flex items-center gap-1 font-gmarket">
            <input
              type="radio"
              name="format"
              value={value}
              checked={format === value}
              onChange={(e) => setFormat(e.target.value)}
            />
            {label}
          </label>
        ))}
      </div><br />

      {/* 무드 선택 */}
      <div className="flex flex-col items-center gap-2">
        {Object.entries(purposeLabels).map(([value, label]) => (
          <label key={value} className="flex items-center gap-1 font-gmarket">
            <input
              type="radio"
              name="purpose"
              value={value}
              checked={purpose === value}
              onChange={(e) => setPurpose(e.target.value)}
            />
            {label}
          </label>
        ))}
      </div>

      <div>
        <label className="block font-bold mb-1">📍</label>
        <div className="flex gap-2 flex-wrap justify-center">
          {['로맨스', '성장물', '미스터리', '스릴러', '철학/심리', '감동/치유'].map((tag) => (
            <label key={tag}
              className={`cursor-pointer rounded-full px-3 py-1 border border-gray-300 text-sm font-medium shadow-sm transition font-gmarket
                ${tags.includes(tag) ? 'bg-pink-300 text-white' : 'bg-white text-black'}`}
            >
              <input
                type="checkbox"
                value={tag}
                checked={tags.includes(tag)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setTags([...tags, tag]);
                  } else {
                    setTags(tags.filter((t) => t !== tag));
                  }
                }}
                className="hidden"
              />
              #{tag}
            </label>
          ))}
        </div>
      </div>

      <button type="submit" className="bg-pink-200 text-fuchsia-400 font-bold px-4 py-2 rounded-xl hover:bg-pink-300 mt-4 shadow">
        ❣️노래 추천❣️
      </button>

      {submitted && selectedVideo && (
        <div className="mt-6 border-t border-pink-200 pt-4">
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}`}
            title="추천 영상"
            frameBorder="0"
            allowFullScreen
            className="mx-auto"
          ></iframe>

          {shareUrl && (
            <div className="mt-4 flex flex-col items-center overflow-x-auto">
              <div className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap flex-nowrap">
                <span>📎 공유 링크</span>

                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="px-3 py-1 border rounded bg-white text-sm text-gray-700 w-[300px] flex-shrink-0"
                  onFocus={(e) => e.target.select()}
                />

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="text-sm bg-pink-200 text-fuchsia-700 px-2 py-1 rounded hover:bg-pink-300 flex-shrink-0"
                >
                  📋 복사
                </button>
              </div>


              {copied && (
                <div className="text-sm text-green-600 mt-2 transition-opacity duration-500 ease-in-out opacity-100">
                  복사 완료! 💫
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </form>
  );
}

export default SurveyForm;
