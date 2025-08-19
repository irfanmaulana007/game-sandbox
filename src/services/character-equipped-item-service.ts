import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from './api';
import { queryClient, queryKeys } from '~/constants/instance';
import type { BaseResponse } from '~/types/api';
import type { EquipmentSlot } from '~/types/model/schema';
import type { EquippedItemWithEquipment } from '~/types/model/equipment';

const BASE_ENDPOINT = '/character-equipped-items';
const CHARACTER_EQUIPPED_ITEM_ENDPOINTS = {
  equippedItems: (characterId: string) => `${BASE_ENDPOINT}/${characterId}`,
  equippedBySlot: (characterId: string, slot: EquipmentSlot) =>
    `${BASE_ENDPOINT}/${characterId}/slot/${slot}`,
  equipToSlot: (
    characterId: string,
    equipmentId: number,
    slot: EquipmentSlot
  ) => `${BASE_ENDPOINT}/${characterId}/equip/${equipmentId}/${slot}`,
  unEquipByItem: (characterId: string, equipmentId: number) =>
    `${BASE_ENDPOINT}/${characterId}/unequip/${equipmentId}`,
  unEquipBySlot: (characterId: string, slot: EquipmentSlot) =>
    `${BASE_ENDPOINT}/${characterId}/unequip-slot/${slot}`,
  swapEquipment: (
    characterId: string,
    equipmentId: number,
    slot: EquipmentSlot
  ) => `${BASE_ENDPOINT}/${characterId}/swap/${equipmentId}/${slot}`,
} as const;

export const characterEquippedItemService = {
  getEquippedItems: async (
    characterId: string
  ): Promise<BaseResponse<EquippedItemWithEquipment[]>> => {
    return apiClient.get(
      CHARACTER_EQUIPPED_ITEM_ENDPOINTS.equippedItems(characterId)
    );
  },
  getEquippedItemsBySlot: async (
    characterId: string,
    slot: EquipmentSlot
  ): Promise<BaseResponse<EquippedItemWithEquipment[]>> => {
    return apiClient.get(
      CHARACTER_EQUIPPED_ITEM_ENDPOINTS.equippedBySlot(characterId, slot)
    );
  },
  equipToSlot: async (
    characterId: string,
    equipmentId: number,
    slot: EquipmentSlot
  ): Promise<BaseResponse<EquippedItemWithEquipment[]>> => {
    return apiClient.post(
      CHARACTER_EQUIPPED_ITEM_ENDPOINTS.equipToSlot(
        characterId,
        equipmentId,
        slot
      )
    );
  },
  unEquipByItem: async (
    characterId: string,
    equipmentId: number
  ): Promise<BaseResponse<EquippedItemWithEquipment[]>> => {
    return apiClient.delete(
      CHARACTER_EQUIPPED_ITEM_ENDPOINTS.unEquipByItem(characterId, equipmentId)
    );
  },
  unEquipBySlot: async (
    characterId: string,
    slot: EquipmentSlot
  ): Promise<BaseResponse<EquippedItemWithEquipment[]>> => {
    return apiClient.delete(
      CHARACTER_EQUIPPED_ITEM_ENDPOINTS.unEquipBySlot(characterId, slot)
    );
  },
  swapEquipment: async (
    characterId: string,
    equipmentId: number,
    slot: EquipmentSlot
  ): Promise<BaseResponse<EquippedItemWithEquipment[]>> => {
    return apiClient.put(
      CHARACTER_EQUIPPED_ITEM_ENDPOINTS.swapEquipment(
        characterId,
        equipmentId,
        slot
      )
    );
  },
};

export const useEquippedItems = (characterId: string) => {
  return useQuery({
    queryKey: queryKeys.characterEquippedItems.all(characterId),
    queryFn: () => characterEquippedItemService.getEquippedItems(characterId),
  });
};

export const useEquippedItemsBySlot = (
  characterId: string,
  slot: EquipmentSlot
) => {
  return useQuery({
    queryKey: queryKeys.characterEquippedItems.equippedBySlot(
      characterId,
      slot
    ),
    queryFn: () =>
      characterEquippedItemService.getEquippedItemsBySlot(characterId, slot),
  });
};

export const useEquipToSlot = (
  characterId: string,
  equipmentId: number,
  slot: EquipmentSlot,
  onSuccess: () => void
) => {
  return useMutation({
    mutationFn: () =>
      characterEquippedItemService.equipToSlot(characterId, equipmentId, slot),
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({
        queryKey: queryKeys.characterEquippedItems.all(characterId),
      });
    },
  });
};

export const useUnEquipByItem = (
  characterId: string,
  equipmentId: number,
  onSuccess: () => void
) => {
  return useMutation({
    mutationFn: () =>
      characterEquippedItemService.unEquipByItem(characterId, equipmentId),
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({
        queryKey: queryKeys.characterEquippedItems.all(characterId),
      });
    },
  });
};

export const useUnEquipBySlot = (
  characterId: string,
  slot: EquipmentSlot,
  onSuccess: () => void
) => {
  return useMutation({
    mutationFn: () =>
      characterEquippedItemService.unEquipBySlot(characterId, slot),
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({
        queryKey: queryKeys.characterEquippedItems.all(characterId),
      });
    },
  });
};

export const useSwapEquipment = (
  characterId: string,
  equipmentId: number,
  slot: EquipmentSlot,
  onSuccess: () => void
) => {
  return useMutation({
    mutationFn: () =>
      characterEquippedItemService.swapEquipment(
        characterId,
        equipmentId,
        slot
      ),
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({
        queryKey: queryKeys.characterEquippedItems.all(characterId),
      });
    },
  });
};
