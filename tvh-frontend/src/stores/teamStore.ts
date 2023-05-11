import { defineStore } from 'pinia';
import { Team, getTeams, getTeam } from 'src/api/teamApi';

export type RootState = {
  teams: Team[]
}

export const useTeamStore = defineStore('team', {
  state: () => ({
    teams: [],
  } as RootState),
  getters: {
    getTeams: (state) => state.teams,
    getTeam:
      (state) => (id: number): Team | null => state.teams.find((team) => team.id === id) || null,
  },
  actions: {
    async fetchTeams() {
      try {
        this.teams = await getTeams();
      } catch (error) {
        console.log(error);
      }
    },
    // fetch complete data to populate only needed data
    async fetchTeam(id: number) {
      try {
        const freshTeamData = await getTeam(id);
        const team = this.getTeam(id);
        if (team === null) {
          this.teams.push(freshTeamData);
        } else {
          this.teams[this.teams.indexOf(team)] = freshTeamData;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
});
