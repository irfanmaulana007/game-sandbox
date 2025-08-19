import EquipmentCard from '~/components/EquipmentCard';
import { Layout } from '~/components/layout';
import { useCharacterEquipment } from '~/services/character-equipment-service';
import { useEquippedItems } from '~/services/character-equipped-item-service';
import { useMyCharacter } from '~/services/character-service';
import { useSellEquipment } from '~/services/transaction-service';

export default function Inventory() {
  const { data: characterData } = useMyCharacter();
  const characterId = characterData?.data?.id;

  const { data: characterEquipmentData } = useCharacterEquipment(characterId);
  const characterEquipments = characterEquipmentData?.data || [];

  const { data: characterEquippedItemsData } = useEquippedItems(
    characterId ?? ''
  );
  const characterEquippedItems = characterEquippedItemsData?.data || [];

  const { mutate: sellEquipment } = useSellEquipment(characterId);

  if (!characterId) {
    return <div>No character found</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {characterEquipments.map((characterEquipment) => {
            const isEquipped = characterEquippedItems.some(
              (item) => item.equipment.id === characterEquipment.equipment.id
            );
            return (
              <EquipmentCard
                key={characterEquipment.id}
                equipment={characterEquipment.equipment}
                onSell={() =>
                  sellEquipment({
                    equipmentId: characterEquipment.equipment.id,
                    characterId: characterId,
                    quantity: 1,
                  })
                }
                isEquipped={isEquipped}
              />
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
