import { TourneyMode } from "../models/tourney-mode";

export interface TourneyModeViewModel {
    label: string,
    mode: TourneyMode,
    hasGroups: boolean,
    hasFirstElimination: boolean
}