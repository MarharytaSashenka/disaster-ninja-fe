import { DrawModeType } from "../constants"
import { drawLineDeckLayerConfig } from "./drawLine"
import { drawPolyDeckLayerConfig } from "./drawPolyLayer"
import { modifyDeckLayerConfig } from "./modifyLayer"
import { viewDeckLayerConfig } from "./viewLayer"


export const layersConfigs: {
  [key in DrawModeType]?: any
} = {
  DrawPolygonMode: drawPolyDeckLayerConfig,
  ViewMode: viewDeckLayerConfig,
  // ViewMode: modifyDeckLayerConfig,
  ModifyMode: modifyDeckLayerConfig,
  DrawLineMode: drawLineDeckLayerConfig
}