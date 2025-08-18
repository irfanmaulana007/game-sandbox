import EquipmentCard from '~/components/EquipmentCard';
import { Layout } from '~/components/layout';
import { useCharacterEquipment } from '~/services/character-equipment';
import { useMyCharacter } from '~/services/character-service';

export default function Inventory() {
  const { data: characterData } = useMyCharacter();
  const characterId = characterData?.data?.id;

  const { data: characterEquipmentData } = useCharacterEquipment(characterId);
  const characterEquipments = characterEquipmentData?.data || [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {characterEquipments.map((characterEquipment) => (
            <EquipmentCard
              key={characterEquipment.id}
              equipment={characterEquipment.equipment}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
