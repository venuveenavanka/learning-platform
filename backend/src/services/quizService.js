// ============================================
// FILE: src/services/quizService.js (FIXED)
// ============================================
const { 
  Question, 
  Option, 
  Topic, 
  QuizAttempt, 
  AttemptAnswer, 
  UserProgress,
  sequelize 
} = require('../models');

class QuizService {
  
  async startQuiz(topicId, userId) {
  const topic = await Topic.findByPk(topicId);
  if (!topic) throw new Error('Topic not found');

  const topicService = require('./topicService');
  const isUnlocked = await topicService.checkTopicUnlockStatus(topicId, userId);
  if (!isUnlocked) throw new Error('Topic is locked');

  // 1) get questions for the topic
  const questions = await Question.findAll({
    where: { topic_id: topicId },
    attributes: ['id', 'body', 'type', 'points'],
    order: sequelize.random()
  });

  if (!questions || questions.length === 0) {
    throw new Error('No questions available for this topic');
  }

  // 2) fetch options for all questions in one query (ordered)
  const questionIds = questions.map(q => q.id);
  const options = await Option.findAll({
    where: { question_id: questionIds },
    attributes: ['id', 'question_id', 'label', 'display_order'],
    order: [['question_id', 'ASC'], ['display_order', 'ASC']]
  });

  // 3) group options by question_id
  const optsByQuestion = {};
  options.forEach(o => {
    optsByQuestion[o.question_id] = optsByQuestion[o.question_id] || [];
    optsByQuestion[o.question_id].push({
      option_id: o.id,
      label: o.label
    });
  });

  // 4) format questions (attach options, hide is_correct)
  const formattedQuestions = questions.map(q => ({
    question_id: q.id,
    body: q.body,
    type: q.type,
    points: q.points,
    options: optsByQuestion[q.id] || []
  }));

  return {
    topic_id: topicId,
    topic_title: topic.title,
    pass_mark: topic.pass_mark,
    questions: formattedQuestions,
    total_questions: formattedQuestions.length
  };
}


// async submitQuiz(topicId, userId, answers) {
//     const topic = await Topic.findByPk(topicId);
    
//     if (!topic) {
//       throw new Error('Topic not found');
//     }

//     const transaction = await sequelize.transaction();

//     try {
//       const questionIds = answers.map(a => a.question_id);
      
//       const questions = await Question.findAll({
//         where: { id: questionIds },
//         include: [{
//           model: Option,
//           attributes: ['id', 'is_correct', 'label'],
//           required: false  // Changed from separate: true
//         }],
//         transaction
//       });

//       // ADD DEBUG
//       console.log('Questions loaded:', questions.length);
//       console.log('First question options:', JSON.stringify(questions[0], null, 2));

//       let totalPoints = 0;
//       let earnedPoints = 0;
//       const detailedFeedback = [];

//       for (const question of questions) {
//         totalPoints += question.points;
        
//         const userAnswer = answers.find(a => a.question_id === question.id);
        
//         // ADD DEBUG - Check both Options and options (case sensitivity)
//         const questionOptions = question.Options || question.options || [];
//         console.log(`Question ${question.id} options:`, questionOptions.length);
        
//         if (questionOptions.length === 0) {
//           console.error(`No options found for question ${question.id}`);
//           continue;
//         }
        
//         let isCorrect = false;
//         let pointsAwarded = 0;

//         if (question.type === 'mcq_single') {
//           const correctOption = questionOptions.find(o => o.is_correct);
          
//           console.log(`Question ${question.id} correct option:`, correctOption?.id);
//           console.log(`User answer:`, userAnswer?.selected_option_ids);
          
//           if (correctOption && userAnswer && userAnswer.selected_option_ids) {
//             isCorrect = userAnswer.selected_option_ids[0] === correctOption.id;
            
//             if (isCorrect) {
//               pointsAwarded = question.points;
//               earnedPoints += pointsAwarded;
//             }
//           }
//         } else if (question.type === 'mcq_multi') {
//           const correctOptionIds = questionOptions
//             .filter(o => o.is_correct)
//             .map(o => o.id)
//             .sort((a, b) => a - b);
          
//           if (userAnswer && userAnswer.selected_option_ids) {
//             const userSelectedIds = [...userAnswer.selected_option_ids].sort((a, b) => a - b);
            
//             isCorrect = JSON.stringify(correctOptionIds) === JSON.stringify(userSelectedIds);
            
//             if (isCorrect) {
//               pointsAwarded = question.points;
//               earnedPoints += pointsAwarded;
//             }
//           }
//         }

//         detailedFeedback.push({
//           question_id: question.id,
//           question_text: question.body,
//           user_answer: userAnswer ? userAnswer.selected_option_ids : [],
//           correct_answer: questionOptions.filter(o => o.is_correct).map(o => o.id),
//           is_correct: isCorrect,
//           points_awarded: pointsAwarded,
//           max_points: question.points,
//           explanation: question.explanation
//         });
//       }

//       // ADD DEBUG
//       console.log('Detailed feedback count:', detailedFeedback.length);
//       console.log('Total points:', totalPoints);
//       console.log('Earned points:', earnedPoints);

//       const scorePercent = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
//       const passed = scorePercent >= topic.pass_mark;

//       const attempt = await QuizAttempt.create({
//         user_id: userId,
//         topic_id: topicId,
//         score_percent: scorePercent,
//         passed,
//         total_points: totalPoints,
//         earned_points: earnedPoints
//       }, { transaction });

//       for (const feedback of detailedFeedback) {
//         await AttemptAnswer.create({
//           attempt_id: attempt.id,
//           question_id: feedback.question_id,
//           selected_option_ids: feedback.user_answer,
//           is_correct: feedback.is_correct,
//           points_awarded: feedback.points_awarded
//         }, { transaction });
//       }

//       let nextTopicUnlocked = false;
//       let nextTopic = null;

//       if (passed) {
//         const previousAttempts = await QuizAttempt.findAll({
//           where: { 
//             user_id: userId, 
//             topic_id: topicId 
//           },
//           attributes: ['id', 'passed'],
//           transaction
//         });

//         const isFirstPass = previousAttempts.filter(a => a.id !== attempt.id && a.passed).length === 0;

//         if (isFirstPass) {
//           const [userProgress] = await UserProgress.findOrCreate({
//             where: { user_id: userId, course_id: topic.course_id },
//             defaults: { last_unlocked_order: 1 },
//             transaction
//           });

//           if (topic.order_index >= userProgress.last_unlocked_order) {
//             await userProgress.update({
//               last_unlocked_order: topic.order_index + 1
//             }, { transaction });

//             nextTopic = await Topic.findOne({
//               where: { 
//                 course_id: topic.course_id,
//                 order_index: topic.order_index + 1
//               },
//               attributes: ['id', 'title'],
//               transaction
//             });

//             if (nextTopic) {
//               nextTopicUnlocked = true;
//             }
//           }
//         }
//       }

//       await transaction.commit();

//       const feedbackWithOptions = detailedFeedback.map(f => {
//         const question = questions.find(q => q.id === f.question_id);
//         const questionOptions = question.Options || question.options || [];
        
//         return {
//           ...f,
//           your_answer_labels: f.user_answer.map(optId => {
//             const opt = questionOptions.find(o => o.id === optId);
//             return opt ? opt.label : 'Unknown';
//           }),
//           correct_answer_labels: f.correct_answer.map(optId => {
//             const opt = questionOptions.find(o => o.id === optId);
//             return opt ? opt.label : 'Unknown';
//           })
//         };
//       });

//       return {
//         attempt_id: attempt.id,
//         score_percent: scorePercent,
//         passed,
//         total_points: totalPoints,
//         earned_points: earnedPoints,
//         pass_mark: topic.pass_mark,
//         feedback: feedbackWithOptions,
//         next_topic_unlocked: nextTopicUnlocked,
//         next_topic: nextTopic
//       };

//     } catch (error) {
//       await transaction.rollback();
//       throw error;
//     }
//   }  


async submitQuiz(topicId, userId, answers) {
  // Validate topic exists
  const topic = await Topic.findByPk(topicId);
  if (!topic) {
    throw new Error('Topic not found');
  }

  const transaction = await sequelize.transaction();

  try {
    const questionIds = answers.map(a => a.question_id);

    // Load questions
    const questions = await Question.findAll({
      where: { id: questionIds },
      attributes: ['id', 'body', 'type', 'points', 'explanation'],
      transaction
    });

    // Load all options for these questions
    const options = await Option.findAll({
      where: { question_id: questionIds },
      attributes: ['id', 'question_id', 'is_correct', 'label', 'display_order'],
      order: [['question_id', 'ASC'], ['display_order', 'ASC']],
      transaction
    });

    // Create option lookup maps
    const optionLookup = {};
    const optionsByQuestion = {};
    
    options.forEach(option => {
      optionLookup[option.id] = option;
      if (!optionsByQuestion[option.question_id]) {
        optionsByQuestion[option.question_id] = [];
      }
      optionsByQuestion[option.question_id].push(option);
    });

    // Score each question
    let totalPoints = 0;
    let earnedPoints = 0;
    const detailedFeedback = [];

    for (const question of questions) {
      totalPoints += question.points;

      const userAnswer = answers.find(a => a.question_id === question.id);
      const userSelectedIds = (userAnswer?.selected_option_ids || []).map(id => Number(id));
      const questionOptions = optionsByQuestion[question.id] || [];

      if (questionOptions.length === 0) {
        console.error(`No options found for question ${question.id}`);
        detailedFeedback.push({
          question_id: question.id,
          question_text: question.body,
          user_answer: userSelectedIds,
          correct_answer: [],
          is_correct: false,
          points_awarded: 0,
          max_points: question.points,
          explanation: question.explanation
        });
        continue;
      }

      let isCorrect = false;
      let pointsAwarded = 0;

      // Handle different question types
      if (question.type === 'mcq_single' || question.type === 'true_false') {
        const correctOption = questionOptions.find(o => o.is_correct);
        if (correctOption && userSelectedIds.length > 0) {
          isCorrect = userSelectedIds[0] === Number(correctOption.id);
          if (isCorrect) {
            pointsAwarded = question.points;
            earnedPoints += pointsAwarded;
          }
        }
      } else if (question.type === 'mcq_multi') {
        const correctOptionIds = questionOptions
          .filter(o => o.is_correct)
          .map(o => Number(o.id))
          .sort((a, b) => a - b);
        
        const userIdsSorted = [...userSelectedIds].sort((a, b) => a - b);
        isCorrect = JSON.stringify(correctOptionIds) === JSON.stringify(userIdsSorted);
        
        if (isCorrect) {
          pointsAwarded = question.points;
          earnedPoints += pointsAwarded;
        }
      }

      detailedFeedback.push({
        question_id: question.id,
        question_text: question.body,
        user_answer: userSelectedIds,
        correct_answer: questionOptions.filter(o => o.is_correct).map(o => Number(o.id)),
        is_correct: isCorrect,
        points_awarded: pointsAwarded,
        max_points: question.points,
        explanation: question.explanation
      });
    }

    // Calculate score
    const scorePercent = totalPoints > 0 
      ? Math.round((earnedPoints / totalPoints) * 100) 
      : 0;
    const passed = scorePercent >= topic.pass_mark;

    // Create quiz attempt record
    const attempt = await QuizAttempt.create({
      user_id: userId,
      topic_id: topicId,
      score_percent: scorePercent,
      passed,
      total_points: totalPoints,
      earned_points: earnedPoints
    }, { transaction });

    // Save individual answer records
    for (const feedback of detailedFeedback) {
      await AttemptAnswer.create({
        attempt_id: attempt.id,
        question_id: feedback.question_id,
        selected_option_ids: feedback.user_answer,
        is_correct: feedback.is_correct,
        points_awarded: feedback.points_awarded
      }, { transaction });
    }

    // Unlock next topic if passed
    let nextTopicUnlocked = false;
    let nextTopic = null;

    if (passed) {
      const previousAttempts = await QuizAttempt.findAll({
        where: { user_id: userId, topic_id: topicId },
        attributes: ['id', 'passed'],
        transaction
      });

      const isFirstPass = previousAttempts.filter(a => 
        a.id !== attempt.id && a.passed
      ).length === 0;

      if (isFirstPass) {
        const [userProgress] = await UserProgress.findOrCreate({
          where: { user_id: userId, course_id: topic.course_id },
          defaults: { last_unlocked_order: 1 },
          transaction
        });

        if (topic.order_index >= userProgress.last_unlocked_order) {
          await userProgress.update({
            last_unlocked_order: topic.order_index + 1
          }, { transaction });

          nextTopic = await Topic.findOne({
            where: { 
              course_id: topic.course_id, 
              order_index: topic.order_index + 1 
            },
            attributes: ['id', 'title'],
            transaction
          });

          if (nextTopic) {
            nextTopicUnlocked = true;
          }
        }
      }
    }

    await transaction.commit();

    // Add human-readable labels to feedback
    const feedbackWithLabels = detailedFeedback.map(f => ({
      ...f,
      your_answer_labels: f.user_answer.map(id => 
        optionLookup[id]?.label || 'Unknown'
      ),
      correct_answer_labels: f.correct_answer.map(id => 
        optionLookup[id]?.label || 'Unknown'
      )
    }));

    return {
      attempt_id: attempt.id,
      score_percent: scorePercent,
      passed,
      total_points: totalPoints,
      earned_points: earnedPoints,
      pass_mark: topic.pass_mark,
      feedback: feedbackWithLabels,
      next_topic_unlocked: nextTopicUnlocked,
      next_topic: nextTopic
    };

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}


}

module.exports = new QuizService();