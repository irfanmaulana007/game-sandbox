import React, { useState } from 'react';
import CharacterSelection from '~/components/CharacterSelection';
import { Button, Card, CardBody, CardHeader } from '~/components/ui';
import type { CharacterJob } from '~/types/character';
import useCharacterStore from '~/store/character-store';
import JOB_LIST from '~/constants/characters/job';
import { useNavigate } from 'react-router-dom';

const OnBoarding: React.FC = () => {
  const navigate = useNavigate();
  const { setCharacter } = useCharacterStore();
  const [characterName, setCharacterName] = useState('');
  const [selectedJob, setSelectedJob] = useState<CharacterJob>(JOB_LIST[0]);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<{ name?: string }>({});

  const getJobDescription = (jobName: string) => {
    const descriptions = {
      Barbarian: 'A fierce warrior with high defense and attack power. Perfect for players who prefer tanking and dealing heavy damage.',
      Swordsman: 'A balanced fighter with good attack and defense. Versatile and suitable for various combat situations.',
      Archer: 'A ranged specialist with high speed and critical chance. Excels at dealing damage from a distance.',
      Ninja: 'A stealthy assassin with exceptional speed and critical strikes. Ideal for players who prefer hit-and-run tactics.',
    };
    return descriptions[jobName as keyof typeof descriptions] || 'A skilled warrior ready for adventure.';
  };

  const getJobIcon = (jobName: string) => {
    const icons = {
      Barbarian: '⚔️',
      Swordsman: '🗡️',
      Archer: '🏹',
      Ninja: '🥷',
    };
    return icons[jobName as keyof typeof icons] || '👤';
  };

  const validateForm = () => {
    const newErrors: { name?: string } = {};
    
    if (!characterName.trim()) {
      newErrors.name = 'Character name is required';
    } else if (characterName.trim().length < 2) {
      newErrors.name = 'Character name must be at least 2 characters';
    } else if (characterName.trim().length > 20) {
      newErrors.name = 'Character name must be less than 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    setCharacter({
      name: characterName.trim(),
      level: 1,
      job: selectedJob,
      experience: 0,
      availableStatusPoints: 0,
    });

    navigate('/character');
  };

  const handleNext = () => {
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Create Your Character
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Choose your class and customize your hero for the adventure ahead
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              currentStep >= 1 
                ? 'bg-blue-600 border-blue-600 text-white' 
                : 'bg-white border-gray-300 text-gray-500 dark:bg-gray-800 dark:border-gray-600'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${
              currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              currentStep >= 2 
                ? 'bg-blue-600 border-blue-600 text-white' 
                : 'bg-white border-gray-300 text-gray-500 dark:bg-gray-800 dark:border-gray-600'
            }`}>
              2
            </div>
          </div>
        </div>

        {currentStep === 1 ? (
          /* Step 1: Job Selection */
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                Choose Your Class
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Select a class that matches your playstyle
              </p>
            </div>

            <CharacterSelection
              selectedJob={selectedJob}
              onSelectJob={setSelectedJob}
            />

            {/* Selected Job Preview */}
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{getJobIcon(selectedJob.name)}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      {selectedJob.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {getJobDescription(selectedJob.name)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.entries(selectedJob.status).map(([stat, value]) => (
                    <div key={stat} className="text-center">
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        {stat}
                      </div>
                      <div className="text-lg font-semibold text-gray-800 dark:text-white">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            <div className="text-center">
              <Button 
                onClick={handleNext}
                size="lg"
                className="px-8"
              >
                Continue to Character Details
              </Button>
            </div>
          </div>
        ) : (
          /* Step 2: Character Details */
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                Character Details
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Give your character a name and finalize your choice
              </p>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{getJobIcon(selectedJob.name)}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {selectedJob.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Level 1 • {getJobDescription(selectedJob.name)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="characterName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Character Name
                    </label>
                    <input
                      id="characterName"
                      type="text"
                      placeholder="Enter your character's name..."
                      value={characterName}
                      onChange={(e) => {
                        setCharacterName(e.target.value);
                        if (errors.name) {
                          setErrors({ ...errors, name: undefined });
                        }
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.name 
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                          : 'border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 dark:text-white mb-3">
                      Starting Stats
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {Object.entries(selectedJob.status).map(([stat, value]) => (
                        <div key={stat} className="text-center">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            {stat}
                          </div>
                          <div className="text-sm font-semibold text-gray-800 dark:text-white">
                            {value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <div className="flex justify-center gap-4">
              <Button 
                onClick={handleBack}
                variant="outline"
                size="lg"
                className="px-8"
              >
                Back
              </Button>
              <Button 
                onClick={handleSubmit}
                size="lg"
                className="px-8"
                disabled={!characterName.trim()}
              >
                Create Character
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnBoarding;
