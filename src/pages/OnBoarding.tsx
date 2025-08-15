import React, { useState } from 'react';
import CharacterSelection from '~/components/CharacterSelection';
import { Button, Card, CardBody } from '~/components/ui';
import type { CharacterJob } from '~/types/character';
import useCharacterStore from '~/store/character-store';
import JOB_LIST from '~/constants/characters/job';
import { useNavigate } from 'react-router-dom';

const OnBoarding: React.FC = () => {
  const navigate = useNavigate();
  const { setCharacter } = useCharacterStore();
  const [characterName, setCharacterName] = useState('');
  const [selectedJob, setSelectedJob] = useState<CharacterJob>(JOB_LIST[0]);

  const handleSubmit = () => {
    setCharacter({
      name: characterName,
      level: 1,
      job: selectedJob!,
      experience: 0,
      availableStatusPoints: 0,
    });

    navigate('/character');
  };

  return (
    <div className="flex gap-x-4 p-4">
      <div className="flex-1">
        <CharacterSelection
          selectedJob={selectedJob}
          onSelectJob={setSelectedJob}
        />
      </div>

      <div className="w-[300px]">
        <Card className="h-full w-full bg-white p-4">
          <CardBody>
            <div className="flex flex-col gap-y-4">
              <h1 className="mb-4 text-xl font-semibold">
                Character information
              </h1>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">job</span>
                <span className="text-sm text-gray-500">
                  {selectedJob.name}
                </span>
              </div>
              <input
                type="text"
                placeholder="Character name"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
              />
              <Button onClick={handleSubmit}>Submit</Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default OnBoarding;
