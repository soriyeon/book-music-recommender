import { useState, useEffect } from 'react';
import musicRecommendations from '../data/musicRecommendations';
import { saveRecommendation } from '../utils/storage';

const formatLabels = {
  '소설': '📖소설',
  '비문학/에세이': '📘비문학/에세이',
  '만화/웹툰': '📕만화/웹툰',
  '교재/공부용': '📚공부용'
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
  const [copied, setCopied] = useState(false);
  const [showSavedMsg, setShowSavedMsg] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    const formatList = musicRecommendations[format] || [];
    const purposeList = musicRecommendations[purpose] || [];

    // 중복 제거
    const seen = new Set();
    const videoList = [...formatList, ...purposeList].filter(entry => {
      const key = entry.youtubeId;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

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
        ❣️Song Drop❣️
      </button>

      {submitted && selectedVideo && (
        <div className="mt-6 border-t border-pink-200 pt-4">
          {/* 추천 결과 요약 */}
          <div className="mb-4 text-sm text-gray-600 font-gmarket">
            <span className="mr-2">{formatLabels[format]}</span>
            <span className="mr-2">{purposeLabels[purpose]}</span>
            {tags.map((tag) => (
              <span key={tag} className="mr-1">#{tag}</span>
            ))}
          </div>

          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}`}
            title="추천 영상"
            frameBorder="0"
            allowFullScreen
            className="mx-auto"
          ></iframe>

          <div className="mt-4 flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const result = saveRecommendation(format, purpose, selectedVideo.youtubeId);
                if (result?.success) {
                  setShowSavedMsg(true);
                  setTimeout(() => {
                    setShowSavedMsg(false);
                    window.location.reload();
                  }, 2000);
                } else if (result?.message) {
                  alert(result.message);
                }
              }}
              className="bg-purple-200 hover:bg-purple-300 text-purple-800 px-4 py-2 rounded-lg shadow font-bold"
            >
              🎀추천 저장🎀
            </button>

            <div className={`text-sm text-pink-600 font-bold transition-opacity duration-700 ease-in-out ${showSavedMsg ? 'opacity-100' : 'opacity-0'}`}>
              ❤️ 추천이 저장되었습니다!
            </div>

            {shareUrl && (
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap flex-nowrap">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="hidden"
                    id="hiddenShareUrl"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById("hiddenShareUrl");
                      input.select();
                      navigator.clipboard.writeText(shareUrl);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="text-sm bg-white text-fuchsia-700 px-3 py-1 rounded flex-shrink-0"
                  >
                    💌SHARE
                  </button>
                </div>
                <div className={`text-sm text-green-600 mt-2 transition-opacity duration-700 ease-in-out ${copied ? 'opacity-100' : 'opacity-0'}`}>
                  복사 완료! 💫
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </form>
  );
}

export default SurveyForm;
