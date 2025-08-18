import { useEffect, useState } from 'react';
import type { CharacterStatus } from '~/types/character';
import {
  useAllocateStatusPoints,
  useResetStatusPoints,
} from '~/services/character-service';
import type { CharacterWithJob } from '~/types/model/character';

export const useAttributeAllocation = (
  character: CharacterWithJob | undefined
) => {
  const { mutate: resetStatusPoints, isPending: resetStatusPointsPending } =
    useResetStatusPoints();

  const [tempAvailablePoints, setTempAvailablePoints] = useState(
    character?.status_points ?? 0
  );
  const [isAllocating, setIsAllocating] = useState(false);
  const [tempStatus, setTempStatus] = useState<CharacterStatus>({
    health: 0,
    attack: 0,
    defense: 0,
    speed: 0,
    critical: 0,
  });

  const allocateStatusPoint = (
    statusKey: keyof CharacterStatus,
    value: number
  ) => {
    setTempAvailablePoints((prev) => prev - 1);
    setTempStatus((prev) => ({
      ...prev,
      [statusKey]: prev[statusKey] + value,
    }));
  };

  const startAllocation = () => {
    setIsAllocating(true);
  };

  const cancelAllocation = () => {
    setIsAllocating(false);
    setTempAvailablePoints(character?.status_points ?? 0);
    setTempStatus({
      health: character?.max_health ?? 0,
      attack: character?.attack ?? 0,
      defense: character?.defense ?? 0,
      speed: character?.speed ?? 0,
      critical: character?.critical ?? 0,
    });
  };

  const applyAllocation = () => {
    if (!character) return;

    allocateStatusPoints({
      characterId: character.id,
      statusPoints: {
        health_points: (tempStatus.health - character.max_health) / 10,
        attack_points: tempStatus.attack - character.attack,
        defense_points: tempStatus.defense - character.defense,
        speed_points: tempStatus.speed - character.speed,
        critical_points: tempStatus.critical - character.critical,
      },
    });
  };

  const resetPoints = () => {
    resetStatusPoints();
  };

  const {
    mutate: allocateStatusPoints,
    isPending: allocateStatusPointsPending,
  } = useAllocateStatusPoints(cancelAllocation);

  useEffect(() => {
    setTempAvailablePoints(character?.status_points ?? 0);
    setTempStatus({
      health: character?.max_health ?? 0,
      attack: character?.attack ?? 0,
      defense: character?.defense ?? 0,
      speed: character?.speed ?? 0,
      critical: character?.critical ?? 0,
    });
  }, [character]);

  return {
    isAllocating,
    tempStatus,
    tempAvailablePoints,
    startAllocation,
    cancelAllocation,
    allocateStatusPoint,
    applyAllocation,
    resetPoints,
    isLoading: resetStatusPointsPending || allocateStatusPointsPending,
  };
};
