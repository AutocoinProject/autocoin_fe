"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // For navigation after submit
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown
import { useAuth } from '@/contexts/AuthContext';
import { createPost } from '@/api/post';
import { toast } from 'sonner';

// 하드코딩된 카테고리 목록
const CATEGORIES = [
  { id: 1, name: '금융' },
  { id: 2, name: '주식' },
  { id: 3, name: '경제' },
  { id: 4, name: '코인' }
] as const;

export default function NewPostPage() {
  const router = useRouter();
  const { isAuthenticated: isLoggedIn, user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [writer, setWriter] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false); // 미리보기 토글 상태
  const [categoryId, setCategoryId] = useState<number>(CATEGORIES[0].id); // 기본값을 '금융'으로 설정

  // 로그인한 사용자 정보로 작성자 필드 초기화
  useEffect(() => {
    if (isLoggedIn && user) {
      setWriter(user.username || user.email.split('@')[0]);
    }
  }, [isLoggedIn, user]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
        setError('파일 크기는 10MB를 초과할 수 없습니다.');
        setFile(null);
        event.target.value = ""; // Clear the input
        return;
      }
      setFile(selectedFile);
      setError(null); // Clear previous error
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (!isLoggedIn) {
      toast.error('로그인이 필요합니다.');
      router.push('/signin');
      return;
    }

    if (!title || !content || !writer) {
      setError('제목, 내용, 작성자는 필수 항목입니다.');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('writer', writer);
    formData.append('categoryId', categoryId.toString());
    if (file) {
      formData.append('file', file);
    }

    const apiUrl = 'http://localhost:8080/api/v1/posts'; 

    try {
      await createPost({
        title: title.trim(),
        content: content.trim(),
        writer: writer.trim(),
        categoryId,
        file: file || undefined
      });
      setSuccessMessage('게시글이 성공적으로 작성되었습니다!');
        setTitle('');
        setContent('');
        setWriter('');
        setFile(null);
        setShowPreview(false);
        setTimeout(() => {
            router.push('/board');
        }, 1500);
    } catch (err) {
      // fetch 자체가 실패한 경우 (네트워크 오류, 서버 무응답 등)
      console.error('Fetch submission error:', err);
      setError('서버에 연결할 수 없거나 응답을 받지 못했습니다. 네트워크 상태를 확인하거나 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 기본 Tailwind 스타일
  const inputBaseStyle = "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 sm:text-sm transition-colors duration-150 ease-in-out";
  const labelBaseStyle = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"; // mb-1 추가
  const buttonBaseStyle = "inline-flex justify-center items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150 ease-in-out";
  const primaryButtonStyle = `${buttonBaseStyle} text-white bg-blue-600 hover:bg-blue-700 border-transparent focus:ring-blue-500 disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed`;
  const secondaryButtonStyle = `${buttonBaseStyle} text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-blue-500`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 flex flex-col items-center"> {/* 페이지 배경색 및 정렬 */}
      <div className="w-full max-w-3xl"> {/* 컨텐츠 최대 너비 제한 */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-900 dark:text-white text-center">
          새 게시글 작성
        </h1>
        <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-xl shadow-2xl"> {/* 내부 간격, 패딩, 그림자 강화 */}
          <div>
            <label htmlFor="category" className={labelBaseStyle}>카테고리</label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className={`${inputBaseStyle} focus:ring-indigo-500 focus:border-indigo-500`}
              required
            >
              {CATEGORIES.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="title" className={labelBaseStyle}>제목</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputBaseStyle}
              required
              placeholder="게시글의 제목을 입력하세요"
            />
          </div>
          <div>
            <label htmlFor="writer" className={labelBaseStyle}>작성자</label>
            <input
              type="text"
              id="writer"
              value={writer}
              onChange={(e) => setWriter(e.target.value)}
              className={inputBaseStyle}
              required
              placeholder="이름 또는 닉네임"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="content" className={labelBaseStyle}>내용 (Markdown 지원)</label>
              <button 
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className={`${secondaryButtonStyle} text-xs px-3 py-1.5`}
              >
                {showPreview ? '미리보기 숨기기' : '미리보기'}
              </button>
            </div>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={18} // 높이 증가 (예: 14 -> 18)
              className={inputBaseStyle}
              required
              placeholder="내용을 마크다운 형식으로 작성해보세요. 예: # 제목, **굵게**, *기울임꼴*"
            />
          </div>

          {showPreview && (
            <div className="space-y-2 pt-2">
              <h3 className={`${labelBaseStyle} text-base`}>미리보기</h3>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-750 min-h-[320px] prose dark:prose-invert max-w-none w-full text-sm overflow-y-auto"> {/* 최소 높이 조정 (예: 250px -> 320px) */}
                {content ? <ReactMarkdown>{content}</ReactMarkdown> : <p className="text-gray-400 dark:text-gray-500">내용을 입력하면 여기에 미리보기가 표시됩니다.</p>}
              </div>
            </div>
          )}

          <div>
            <label htmlFor="file" className={labelBaseStyle}>파일 첨부 (선택, 최대 10MB)</label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-800/40 transition-colors duration-150 cursor-pointer"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
              <p className="text-sm font-medium text-red-600 dark:text-red-300 text-center">{error}</p>
            </div>
          )}
          {successMessage && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
              <p className="text-sm font-medium text-green-600 dark:text-green-300 text-center">{successMessage}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                  type="button"
                  onClick={() => router.back()} 
                  className={`${secondaryButtonStyle} w-full sm:w-auto`}
              >
                  취소
              </button>
              <button
                  type="submit"
                  disabled={isLoading}
                  className={`${primaryButtonStyle} w-full sm:w-auto`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    등록 중...
                  </>
                ) : (
                  '글쓰기 완료'
                )}
              </button>
          </div>
        </form>
      </div>
    </div>
  );
} 