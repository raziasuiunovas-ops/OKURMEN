'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Play,
  Award,
  AlertCircle,
  Loader2,
  Trophy,
} from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  order: number;
}

interface LessonData {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  duration: number;
  order: number;
  isCompleted: boolean;
  courseId: string;
  courseTitle: string;
  hasQuiz: boolean;
  nextLessonId: string | null;
}

interface QuizData {
  questions: Question[];
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<{
    passed: boolean;
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    tokensEarned: number;
  } | null>(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('auth-token='))
          ?.split('=')[1];

        const response = await fetch(
          `http://localhost:3002/api/student/lessons/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();
        if (result.success) {
          setLesson(result.data);
          
          // Если урок завершен и есть квиз, показываем его сразу
          if (result.data.isCompleted && result.data.hasQuiz) {
            await fetchQuiz();
          }
        } else {
          router.push('/courses');
        }
      } catch (error) {
        console.error('Lesson fetch error:', error);
        router.push('/courses');
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [params.id, router]);

  const fetchQuiz = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth-token='))
        ?.split('=')[1];

      const response = await fetch(
        `http://localhost:3002/api/student/quiz/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        setQuiz(result.data);
      }
    } catch (error) {
      console.error('Quiz fetch error:', error);
    }
  };

  const handleCompleteLesson = async () => {
    if (!lesson || completing) return;

    setCompleting(true);
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth-token='))
        ?.split('=')[1];

      const response = await fetch(
        `http://localhost:3002/api/student/lessons/${params.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        setLesson({ ...lesson, isCompleted: true });
        
        // Если есть квиз, загружаем и показываем его
        if (lesson.hasQuiz) {
          await fetchQuiz();
          setShowQuiz(true);
        }
      }
    } catch (error) {
      console.error('Complete lesson error:', error);
    } finally {
      setCompleting(false);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!quiz || quizSubmitting) return;

    // Проверяем, что все вопросы отвечены
    const allAnswered = quiz.questions.every(q => answers[q.id] !== undefined);
    if (!allAnswered) {
      alert('Пожалуйста, ответьте на все вопросы');
      return;
    }

    setQuizSubmitting(true);
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth-token='))
        ?.split('=')[1];

      const response = await fetch(
        `http://localhost:3002/api/student/quiz/${params.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ answers }),
        }
      );

      const result = await response.json();
      if (result.success) {
        setQuizResult(result.data);
      }
    } catch (error) {
      console.error('Submit quiz error:', error);
    } finally {
      setQuizSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!lesson) {
    return null;
  }

  const durationMin = Math.ceil(lesson.duration / 60);

  // Quiz Result View
  if (quizResult) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${
            quizResult.passed
              ? 'bg-green-100 dark:bg-green-900/30'
              : 'bg-red-100 dark:bg-red-900/30'
          }`}>
            {quizResult.passed ? (
              <Trophy className="w-12 h-12 text-green-600 dark:text-green-400" />
            ) : (
              <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {quizResult.passed ? 'Поздравляем!' : 'Попробуй еще раз'}
          </h1>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {quizResult.score}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Результат</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {quizResult.correctAnswers}/{quizResult.totalQuestions}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Правильных ответов</div>
              </div>
            </div>

            {quizResult.passed && quizResult.tokensEarned > 0 && (
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl p-6">
                <div className="flex items-center justify-center gap-3">
                  <Award className="w-8 h-8" />
                  <div>
                    <div className="text-lg font-bold">+{quizResult.tokensEarned} ОКУРМЭН</div>
                    <div className="text-sm opacity-90">Токены начислены</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 justify-center mt-6">
            {lesson.nextLessonId ? (
              <Link
                href={`/lessons/${lesson.nextLessonId}`}
                className="btn-primary"
              >
                Следующий урок
              </Link>
            ) : (
              <Link
                href={`/courses/${lesson.courseId}`}
                className="btn-primary"
              >
                Вернуться к курсу
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Quiz View
  if (showQuiz && quiz) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Тест: {lesson.title}
          </h1>
          <button
            onClick={() => setShowQuiz(false)}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {quiz.questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                {index + 1}. {question.question}
              </h3>
              <div className="space-y-3">
                {question.options.map((option, optionIndex) => (
                  <label
                    key={optionIndex}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      answers[question.id] === optionIndex
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      checked={answers[question.id] === optionIndex}
                      onChange={() => setAnswers({ ...answers, [question.id]: optionIndex })}
                      className="w-5 h-5 text-primary-600"
                    />
                    <span className="text-gray-900 dark:text-white">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSubmitQuiz}
            disabled={quizSubmitting}
            className="btn-primary flex items-center gap-2"
          >
            {quizSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Проверка...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Отправить ответы
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Lesson View
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back button */}
      <Link
        href={`/courses/${lesson.courseId}`}
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Назад к курсу
      </Link>

      {/* Video Player */}
      <div className="bg-black rounded-2xl overflow-hidden aspect-video">
        {lesson.videoUrl ? (
          <iframe
            src={lesson.videoUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-900">
            <div className="text-center text-white">
              <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg opacity-75">Видео пока не загружено</p>
            </div>
          </div>
        )}
      </div>

      {/* Lesson Info */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {lesson.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{lesson.courseTitle}</p>
          </div>
          {lesson.isCompleted && (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Завершено</span>
            </div>
          )}
        </div>

        {lesson.description && (
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {lesson.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <span>Длительность: {durationMin} мин</span>
          {lesson.hasQuiz && <span>• Включает тест</span>}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4">
          {!lesson.isCompleted ? (
            <button
              onClick={handleCompleteLesson}
              disabled={completing}
              className="btn-primary flex items-center gap-2"
            >
              {completing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Завершение...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Завершить урок (+1 токен)
                </>
              )}
            </button>
          ) : (
            <>
              {lesson.hasQuiz && (
                <button
                  onClick={() => setShowQuiz(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Award className="w-5 h-5" />
                  Пройти тест
                </button>
              )}
              {lesson.nextLessonId && (
                <Link
                  href={`/lessons/${lesson.nextLessonId}`}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  Следующий урок
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
