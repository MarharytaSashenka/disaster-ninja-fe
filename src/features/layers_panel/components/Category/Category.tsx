import { useState } from 'react';
import { useAtom } from '@reatom/react';
import { Collapse } from '../Collapse/Collapse';
import { mountedLayersByCategoryAtom } from '../../atoms/mountedLayersByCategory';
import { Group } from '../Group/Group';
import type { CategoryWithSettings } from '~core/logical_layers/atoms/layersTree/types';
import s from './Category.module.css';

function CategoryMountedLayersCounter({ categoryId }: { categoryId: string }) {
  const [counters] = useAtom(mountedLayersByCategoryAtom);
  return <span className={s.mountedLayersCounter}>{counters[categoryId]}</span>;
}

export function Category({ category }: { category: CategoryWithSettings }) {
  const [isOpen, setOpenState] = useState(category.openByDefault ?? false);

  return (
    <Collapse
      open={isOpen}
      label={
        <div className={s.categoryTitle}>
          <span>{category.name}</span>
          {!category.mutuallyExclusive ? (
            <CategoryMountedLayersCounter categoryId={category.id} />
          ) : null}
        </div>
      }
      onStateChange={(newState) => setOpenState(!newState)}
    >
      {category.children.map((group) => (
        <Group
          key={group.id}
          group={group}
          mutuallyExclusive={category.mutuallyExclusive}
        />
      ))}
    </Collapse>
  );
}