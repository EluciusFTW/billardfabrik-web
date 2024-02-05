import { TourneyMode } from "../models/tourney-mode";

export interface TourneyModeViewModel {
    mode: TourneyMode,
    hasGroups: boolean,
    hasFirstElimination: boolean
}
