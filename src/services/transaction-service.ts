import { useMutation } from '@tanstack/react-query';
import { apiClient } from './api';
import type { BaseResponse } from '~/types/api';
import type {
  BuyEquipmentRequest,
  SellEquipmentRequest,
} from '~/types/request/transaction';
import type { TransactionResponse } from '~/types/response/transaction';
import { queryClient, queryKeys } from '~/constants/instance';

const BASE_ENDPOINT = '/transactions';
const TRANSACTION_ENDPOINTS = {
  buy: `${BASE_ENDPOINT}/buy`,
  sell: `${BASE_ENDPOINT}/sell`,
} as const;

export const transactionService = {
  buy: async (
    request: BuyEquipmentRequest
  ): Promise<BaseResponse<TransactionResponse>> => {
    return apiClient.post(TRANSACTION_ENDPOINTS.buy, request);
  },
  sell: async (
    request: SellEquipmentRequest
  ): Promise<BaseResponse<TransactionResponse>> => {
    return apiClient.post(TRANSACTION_ENDPOINTS.sell, request);
  },
};

export const useBuyEquipment = (characterId?: string) => {
  return useMutation({
    mutationFn: (request: BuyEquipmentRequest) =>
      transactionService.buy(request),
    onSuccess: (response) => {
      console.log('Sell equipment success, invalidating queries...');
      queryClient.invalidateQueries({ queryKey: queryKeys.characters.me });
      
      // Invalidate character equipment queries more comprehensively
      const characterIdsToInvalidate = [
        response.data.characterId,
        characterId,
      ].filter((id): id is string => Boolean(id));
      
      console.log('Invalidating character equipment for IDs:', characterIdsToInvalidate);
      
      characterIdsToInvalidate.forEach((id) => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.characterEquipment.all(id),
        });
      });
      
      // Also invalidate any character equipment queries that might exist
      queryClient.invalidateQueries({
        predicate: (query) => 
          query.queryKey[0] === 'character-equipment',
      });
      
      console.log('Query invalidation completed');
    },
  });
};

export const useSellEquipment = (characterId?: string) => {
  return useMutation({
    mutationFn: (request: SellEquipmentRequest) =>
      transactionService.sell(request),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.characters.me });
      
      // Invalidate character equipment queries more comprehensively
      const characterIdsToInvalidate = [
        response.data.characterId,
        characterId,
      ].filter((id): id is string => Boolean(id));
      
      characterIdsToInvalidate.forEach((id) => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.characterEquipment.all(id),
        });
      });
      
      // Also invalidate any character equipment queries that might exist
      queryClient.invalidateQueries({
        predicate: (query) => 
          query.queryKey[0] === 'character-equipment',
      });
    },
  });
};
