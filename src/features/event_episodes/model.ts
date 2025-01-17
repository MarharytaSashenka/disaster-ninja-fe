import { currentEpisodeAtom } from '~core/shared_state';
import { episodesPanelState } from '~core/shared_state';
import { episodesResource } from './atoms/episodesResource';
import { episodesTimeline } from './atoms/episodesTimeline';

export const eventEpisodesModel = {
  currentEventEpisodes: episodesResource, // List of episodes
  currentEpisode: currentEpisodeAtom, // Selected episode
  episodesPanelState: episodesPanelState, // Panel settings
  episodesTimelineState: episodesTimeline, // Timeline settings
};
