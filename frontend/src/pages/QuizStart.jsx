import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import { quizAPI } from '../services/api'
import { showToast } from '../components/ToastContainer'

export default function QuizStart() {
  const { topicId } = useParams()
  const [quiz, setQuiz] = useState(null)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    startQuiz()
  }, [topicId])

  const startQuiz = async () => {
    try {
      setLoading(true)
      const response = await quizAPI.start(parseInt(topicId))
      if (response.data.success) {
        setQuiz(response.data.data.quiz)
        setResult(null)
        setAnswers({})
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to start quiz', 'error')
      navigate(-1)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (questionId, optionId, isMulti) => {
    if (isMulti) {
      const current = answers[questionId] || []
      const updated = current.includes(optionId)
        ? current.filter(id => id !== optionId)
        : [...current, optionId]
      setAnswers({ ...answers, [questionId]: updated })
    } else {
      setAnswers({ ...answers, [questionId]: [optionId] })
    }
  }

  const submitQuiz = async () => {
    if (Object.keys(answers).length !== quiz.questions.length) {
      showToast('Please answer all questions', 'warning')
      return
    }

    setSubmitting(true)
    try {
      const formattedAnswers = Object.entries(answers).map(([qId, optIds]) => ({
        question_id: parseInt(qId),
        selected_option_ids: optIds
      }))

      const response = await quizAPI.submit(parseInt(topicId), formattedAnswers)
      if (response.data.success) {
        setResult(response.data.data.result)
        showToast(
          response.data.data.result.passed ? 'Congratulations! You passed!' : 'Keep trying!',
          response.data.data.result.passed ? 'success' : 'error'
        )
      }
    } catch (error) {
      showToast('Failed to submit quiz', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-screen">
          <div className="spinner"></div>
        </div>
      </>
    )
  }

  // Show Result Screen
  if (result) {
    return (
      <>
        <Navbar />
        <div className="container">
          <Card className={`result-card ${result.passed ? 'result-success' : 'result-fail'}`}>
            <div className="result-icon">
              {result.passed ? '🎉' : '😔'}
            </div>
            <h1>{result.passed ? 'Congratulations!' : 'Keep Trying!'}</h1>
            
            <div className="result-score">
              <div className="score-circle">
                <span className="score-value">{result.score_percent}%</span>
                <span className="score-label">Your Score</span>
              </div>
            </div>

            <div className="result-stats">
              <div className="result-stat">
                <span>Earned Points</span>
                <strong>{result.earned_points}/{result.total_points}</strong>
              </div>
              <div className="result-stat">
                <span>Pass Mark</span>
                <strong>{result.pass_mark}%</strong>
              </div>
              <div className="result-stat">
                <span>Status</span>
                <strong className={result.passed ? 'success' : 'danger'}>
                  {result.passed ? 'Passed ✅' : 'Failed ❌'}
                </strong>
              </div>
            </div>

            {result.next_topic_unlocked && result.next_topic && (
              <div className="next-topic-alert">
                <span>🎊</span>
                <p>New topic unlocked: <strong>{result.next_topic.title}</strong></p>
              </div>
            )}

            <div className="result-feedback">
              <h3>Question Review</h3>
              {result.feedback.map((fb, idx) => (
                <Card key={idx} className="feedback-item">
                  <div className="feedback-header">
                    <span className="question-number">Q{idx + 1}</span>
                    <span className={`feedback-badge ${fb.is_correct ? 'true' : 'false'}`}>
                      {fb.is_correct ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                  </div>
                  <p className="question-text">{fb.question_text}</p>
                  <div className="answer-review">
                    <p><strong>Your answer:</strong> {fb.your_answer_labels?.join(', ')}</p>
                    {!fb.is_correct && (
                      <p className="correct-answer">
                        <strong>Correct answer:</strong> {fb.correct_answer_labels?.join(', ')}
                      </p>
                    )}
                  </div>
                  {fb.explanation && (
                    <p className="explanation">💡 {fb.explanation}</p>
                  )}
                </Card>
              ))}
            </div>

            <div className="result-actions">
              <button onClick={() => startQuiz()} className="btn-secondary">
                Retry Quiz
              </button>
              <button onClick={() => navigate(-1)} className="btn-primary">
                Back to Course
              </button>
            </div>
          </Card>
        </div>
      </>
    )
  }

  // Show Quiz Questions
  return (
    <>
      <Navbar />
      <div className="container">
        <Card className="quiz-header">
          <h1>{quiz?.topic_title}</h1>
          <div className="quiz-progress">
            <span>Questions Answered: {Object.keys(answers).length} / {quiz?.questions.length}</span>
            <span>Pass Mark: {quiz?.pass_mark}%</span>
          </div>
        </Card>

        <div className="quiz-questions">
          {quiz?.questions.map((question, idx) => {
            const isMulti = question.type === 'mcq_multi'
            const userAnswer = answers[question.question_id] || []

            return (
              <Card key={question.question_id} className="question-card">
  <div className="question-header">
    <span className="question-number">Question {idx + 1}</span>

    {/* Question Type Badge */}
    <span
      className={`type-badge ${
        question.type === 'mcq_multi'
          ? 'multi'
          : question.type === 'mcq_single'
          ? 'single'
          : 'truefalse'
      }`}
    >
      {question.type === 'mcq_multi' && 'Multiple Choice'}
      {question.type === 'mcq_single' && 'Single Choice'}
      {question.type === 'true_false' && 'True / False'}
    </span>
  </div>

  <p className="question-text">{question.body}</p>

  <div className="options-list">
    {question.options.map(option => {
      const isSelected = userAnswer.includes(option.option_id)

      return (
        <label
          key={option.option_id}
          className={`option-label ${isSelected ? 'selected' : ''}`}
        >
          <input
            type={question.type === 'mcq_multi' ? 'checkbox' : 'radio'}
            name={`question-${question.question_id}`}
            checked={isSelected}
            onChange={() =>
              handleAnswerChange(
                question.question_id,
                option.option_id,
                question.type === 'mcq_multi'
              )
            }
          />
          <span className="option-text">{option.label}</span>
          <span className="checkmark"></span>
        </label>
      )
    })}
  </div>
</Card>

            )
          })}
        </div>

        <Card className="quiz-footer">
          <button
            onClick={submitQuiz}
            className="btn-primary btn-lg"
            disabled={submitting || Object.keys(answers).length !== quiz?.questions.length}
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
          <p className="submit-hint">
            {Object.keys(answers).length === quiz?.questions.length
              ? '✅ All questions answered'
              : `⚠️ Answer all questions (${Object.keys(answers).length}/${quiz?.questions.length})`}
          </p>
        </Card>
      </div>
    </>
  )
}