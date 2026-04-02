import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';
import { usePreferences } from '../hooks/usePreferences';
import { useResponsive } from '../hooks/useResponsive';
import Logo from '../components/ui/Logo';
import quizConfig from '../data/quizConfig.json';

const EMOJI_MAP = {
  'light-and-easy': '🌤️',
  'ready-for-something-special': '✨',
  'curious-and-adventurous': '🧭',
  'just-need-a-good-beer': '🍺',
  'light-and-citrusy': '🍋',
  'rich-and-complex': '🌳',
  'funky-and-sour': '🔬',
  'smoky-and-deep': '🔥',
  'sofa-film-sunday': '🛋️',
  'dinner-with-people': '🍽️',
  'outside-sunshine': '☀️',
  'alone-quietly': '🧘',
  'new-to-it': '👶',
  'know-what-i-like': '💪',
  'want-to-be-surprised': '🎁',
  'take-this-seriously': '👑',
};

export default function QuizPage() {
  const navigate = useNavigate();
  const { saveProfile } = usePreferences();
  const isMobile = useResponsive(768);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const questions = quizConfig.questions;
  const profiles = quizConfig.profiles;
  const question = questions[currentQuestion];

  const getEmojiForOption = (text) => {
    const key = text.toLowerCase().replace(/\s+/g, '-');
    return EMOJI_MAP[key] || '🍻';
  };

  const handleSelectAnswer = (optionIndex) => {
    if (isTransitioning) return;

    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (currentQuestion === questions.length - 1) {
      // Last question - show result
      setTimeout(() => {
        const profile = calculateProfile(newAnswers);
        setSelectedProfile(profile);
        setShowResult(true);
      }, 300);
    } else {
      // Move to next question
      setTimeout(() => {
        setIsTransitioning(true);
        setCurrentQuestion(currentQuestion + 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const calculateProfile = (answers) => {
    // Tally all mood tags from selected answers
    const moodCount = {};

    answers.forEach((answerIndex, questionIndex) => {
      const selectedOption = questions[questionIndex].options[answerIndex];
      selectedOption.moods.forEach((mood) => {
        moodCount[mood] = (moodCount[mood] || 0) + 1;
      });
    });

    // Find which profile has the most matching dominant moods
    let bestProfile = profiles[0];
    let bestMatch = 0;

    profiles.forEach((profile) => {
      let matchCount = 0;
      profile.dominantMoods.forEach((mood) => {
        matchCount += moodCount[mood] || 0;
      });

      if (matchCount > bestMatch) {
        bestMatch = matchCount;
        bestProfile = profile;
      }
    });

    return bestProfile;
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswers(answers.slice(0, -1));
    }
  };

  const handleCancel = () => {
    navigate('/discover');
  };

  const handleDiscoverClick = () => {
    // Save profile to cookie
    saveProfile({ id: selectedProfile.id, name: selectedProfile.name });
    Cookies.set('beerworld_profile', JSON.stringify({ id: selectedProfile.id, name: selectedProfile.name }), { expires: 30 });
    navigate('/discover');
  };

  if (showResult && selectedProfile) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--background-primary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <div style={{ marginBottom: '3rem' }}>
          <Logo variant="icon" />
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ maxWidth: '600px' }}
        >
          <h1 style={{
            fontSize: '3.5rem',
            fontFamily: 'Bebas Neue',
            color: 'var(--text-primary)',
            margin: '0 0 1rem 0',
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}>
            {selectedProfile.name}
          </h1>

          <p style={{
            fontSize: '1.125rem',
            fontFamily: 'DM Sans',
            color: 'var(--text-secondary)',
            marginBottom: '3rem',
            lineHeight: 1.6,
          }}>
            Based on your answers, we think you'll love exploring craft beers that match your unique taste preferences. Ready to discover beers made just for you?
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDiscoverClick}
            style={{
              backgroundColor: 'var(--accent-amber)',
              color: 'var(--background-primary)',
              border: 'none',
              padding: '1rem 2rem',
              fontSize: '1.125rem',
              fontFamily: 'Bebas Neue',
              fontWeight: '700',
              borderRadius: '6px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '2rem',
              transition: 'all 200ms ease',
            }}
          >
            Discover your beers →
          </motion.button>

          <p style={{
            fontSize: '0.875rem',
            fontFamily: 'DM Sans',
            color: 'var(--text-muted)',
          }}>
            We have saved your taste profile
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--background-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: '2rem' }}>
        <Logo variant="icon" />
      </div>

      {/* Progress Dots */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {questions.map((_, index) => (
          <div
            key={index}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              border: '2px solid',
              backgroundColor:
                index < currentQuestion
                  ? 'var(--accent-amber)'
                  : 'transparent',
              borderColor:
                index === currentQuestion
                  ? 'var(--accent-amber)'
                  : 'var(--border-medium)',
              transition: 'all 300ms ease',
            }}
          />
        ))}
      </div>

      {/* Question Counter */}
      <p style={{
        fontSize: '0.875rem',
        fontFamily: 'DM Sans',
        color: 'var(--text-muted)',
        marginBottom: '2rem',
      }}>
        Question {currentQuestion + 1} of {questions.length}
      </p>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            width: '100%',
            maxWidth: '800px',
            marginBottom: '3rem',
            textAlign: 'center',
          }}
        >
          <h2 style={{
            fontSize: '2rem',
            fontFamily: 'Bebas Neue',
            color: 'var(--text-primary)',
            margin: '0 0 1rem 0',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            lineHeight: 1.2,
          }}>
            {question.question}
          </h2>

          <p style={{
            fontSize: '0.95rem',
            fontFamily: 'DM Sans',
            color: 'var(--text-secondary)',
            margin: 0,
          }}>
            Choose what resonates most with you right now
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Options Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`options-${currentQuestion}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          style={{
            width: '100%',
            maxWidth: '1000px',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          {question.options.map((option, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelectAnswer(index)}
              style={{
                position: 'relative',
                padding: '1.5rem',
                backgroundColor: 'var(--background-secondary)',
                border: '2px solid var(--border-medium)',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 200ms ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem',
                textAlign: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-amber)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-medium)';
              }}
            >
              <span style={{ fontSize: '2rem' }}>
                {getEmojiForOption(option.text)}
              </span>

              <span style={{
                fontFamily: 'DM Sans',
                fontSize: '0.95rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
              }}>
                {option.text}
              </span>
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Button Group */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {/* Back Button */}
        {currentQuestion > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleBack}
            style={{
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-medium)',
              padding: '0.75rem 1.5rem',
              fontSize: '0.95rem',
              fontFamily: 'DM Sans',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 200ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-amber)';
              e.currentTarget.style.color = 'var(--accent-amber)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-medium)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            ← Back
          </motion.button>
        )}

        {/* Cancel Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleCancel}
          style={{
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-medium)',
            padding: '0.75rem 1.5rem',
            fontSize: '0.95rem',
            fontFamily: 'DM Sans',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 200ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--text-secondary)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-medium)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          ✕ Cancel
        </motion.button>
      </div>
    </div>
  );
}
