import {
  useCallback,
  useMemo,
  useReducer,
  useState,
  useSyncExternalStore,
} from 'react';
import type { PresetGroup, PresetGroupsInput } from '../types';
import { getColorHistory, addToColorHistory } from '../utils';

/** Upper bound on how many swatches a user can keep in the editable row. */
export const MAX_CUSTOM_PRESETS = 24;

type PresetAction =
  | { type: 'set'; presets: string[] }
  | { type: 'update'; index: number; color: string }
  | { type: 'delete'; index: number }
  | { type: 'add'; color: string; limit: number };

function presetsReducer(state: string[], action: PresetAction): string[] {
  switch (action.type) {
    case 'set':
      return [...action.presets];
    case 'update': {
      if (action.index < 0 || action.index >= state.length) return state;
      const next = [...state];
      next[action.index] = action.color;
      return next;
    }
    case 'delete':
      return state.filter((_, i) => i !== action.index);
    case 'add':
      return state.length < action.limit ? [...state, action.color] : state;
    default:
      return state;
  }
}

/**
 * Editable swatch state: the working preset list plus the named groups a user
 * can load into it.
 */
export function usePresets(
  presets: string[],
  presetGroups: PresetGroupsInput | undefined
) {
  const [customPresets, dispatch] = useReducer(
    presetsReducer,
    presets,
    (initial) => [...initial]
  );

  const [selectedPresetGroup, setSelectedPresetGroup] = useState<string | null>(
    null
  );

  const normalizedPresetGroups = useMemo<PresetGroup[]>(() => {
    if (!presetGroups) return [];
    if (Array.isArray(presetGroups)) return presetGroups;
    return Object.entries(presetGroups).map(([name, colors]) => ({
      name,
      colors,
    }));
  }, [presetGroups]);

  const updatePreset = useCallback((index: number, color: string) => {
    dispatch({ type: 'update', index, color });
  }, []);

  const deletePreset = useCallback((index: number) => {
    dispatch({ type: 'delete', index });
  }, []);

  const addPreset = useCallback((color: string) => {
    dispatch({ type: 'add', color, limit: MAX_CUSTOM_PRESETS });
  }, []);

  const loadPresetGroup = useCallback(
    (groupName: string) => {
      const group = normalizedPresetGroups.find((g) => g.name === groupName);
      if (group) {
        dispatch({ type: 'set', presets: group.colors });
        setSelectedPresetGroup(groupName);
      }
    },
    [normalizedPresetGroups]
  );

  return {
    customPresets,
    normalizedPresetGroups,
    selectedPresetGroup,
    updatePreset,
    deletePreset,
    addPreset,
    loadPresetGroup,
  };
}

/** Recently used colors, persisted to localStorage when enabled. */
export function useColorHistory(enabled: boolean, size: number) {
  const subscribe = useCallback((onStoreChange: () => void) => {
    window.addEventListener('chromakit-history-change', onStoreChange);
    window.addEventListener('storage', onStoreChange);
    return () => {
      window.removeEventListener('chromakit-history-change', onStoreChange);
      window.removeEventListener('storage', onStoreChange);
    };
  }, []);

  const getSnapshot = useCallback(
    () => JSON.stringify(enabled ? getColorHistory().slice(0, size) : []),
    [enabled, size]
  );
  const serializedHistory = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => '[]'
  );
  const history = useMemo(
    () => JSON.parse(serializedHistory) as string[],
    [serializedHistory]
  );

  const remember = useCallback(
    (color: string) => {
      if (!enabled) return;
      addToColorHistory(color, size);
      window.dispatchEvent(new Event('chromakit-history-change'));
    },
    [enabled, size]
  );

  return { history, remember };
}
