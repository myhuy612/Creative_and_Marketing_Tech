// src/server/presets/targetAudiencePresetRepository.ts
import type { TargetAudiencePreset } from "@/types/targetAudiencePreset";
import { STATIC_TARGET_AUDIENCE_PRESETS } from "./staticTargetAudiencePresets";

/**
 * 将来DB導入時に、ここだけ差し替える。
 * - list(): DBから取得
 * - create/update/delete を追加
 */
export interface TargetAudiencePresetRepository {
  list(): Promise<TargetAudiencePreset[]>;
}

class StaticTargetAudiencePresetRepository implements TargetAudiencePresetRepository {
  async list(): Promise<TargetAudiencePreset[]> {
    // deletedAt のあるものを除外（将来ソフトデリート運用する場合に備える）
    return STATIC_TARGET_AUDIENCE_PRESETS.filter((p) => !p.deletedAt);
  }
}

/**
 * 将来例：
 * - process.env.PRESET_SOURCE === "db" のとき DbPresetRepository を返す
 */
export function getTargetAudiencePresetRepository(): TargetAudiencePresetRepository {
  return new StaticTargetAudiencePresetRepository();
}
